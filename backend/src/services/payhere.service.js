import crypto from "crypto";
import * as transactionService from "./transaction.service.js";
import * as transactionRepository from "../repository/transaction.repository.js";

const isDevMode = process.env.NODE_ENV !== "production";
/**
 * Generate MD5 hash for PayHere
 */
const generateHash = (merchantId, orderId, amount, currency, merchantSecret) => {
    // PayHere requires exactly 2 decimal places for the amount in the hash
    const formattedAmount = parseFloat(amount).toFixed(2);
    
    // Trim to avoid whitespace issues from .env
    const mid = merchantId.toString().trim();
    const msec = merchantSecret.toString().trim();
    
    const secretHash = crypto.createHash("md5").update(msec).digest("hex").toUpperCase();
    const hashString = `${mid}${orderId}${formattedAmount}${currency}${secretHash}`;
    
    return crypto.createHash("md5").update(hashString).digest("hex").toUpperCase();
};

/**
 * Initialize PayHere payment
 */
export const initPayHerePayment = async (paymentData) => {
    const {
        donorId,
        ngoId,
        campaignId,
        amount,
        currency = "LKR",
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        country,
    } = paymentData;

    if (!donorId || !ngoId || !amount || !firstName || !lastName || !email || !phone) {
        throw new Error("Missing required payment fields");
    }

    // Generate unique order ID (Numerical only for maximal compatibility)
    const orderId = `${Date.now()}`;

    // Get PayHere credentials from environment
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchantId || !merchantSecret) {
        throw new Error("PayHere credentials not configured Hub");
    }

    // Generate hash Hub
    const hash = generateHash(merchantId, orderId, amount, currency, merchantSecret);

    // If it's a pledge, store it in the donor profile
    if (paymentData.type === 'pledge') {
        try {
            const Donor = (await import('../models/donor.model.js')).default;
            let donor = await Donor.findOne({ userId: donorId });
            
            const pledgeData = {
                amount: parseFloat(amount),
                frequency: paymentData.frequency || 'monthly',
                campaign: campaignId,
                status: 'pending',
                notes: `Success: Pledge Hub`
            };

            if (!donor) {
                await Donor.create({
                    userId: donorId,
                    phone: phone,
                    address: { street: address || 'Colombo', city: city || 'Colombo', country: 'Sri Lanka' },
                    pledges: [pledgeData]
                });
            } else {
                donor.pledges.push(pledgeData);
                await donor.save();
            }
        } catch (pledgeErr) {
            console.error("Pledge registration error Hub:", pledgeErr.message);
        }
    }

    // Create pending transaction
    const transaction = await transactionService.createTransaction({
        donorId,
        ngoId,
        campaignId,
        amount,
        currency,
        status: "pending",
        orderId: orderId,
        paymentMethod: "PayHere",
        type: paymentData.type || "one-time",
    });

    // Return PayHere payment initialization data
    return {
        transactionId: transaction._id,
        paymentData: {
            merchant_id: merchantId,
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?order_id=${orderId}&transaction_id=${transaction._id}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`,
            notify_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/finance/payhere/callback`,
            order_id: orderId,
            items: "MissionGift",
            currency,
            amount: parseFloat(amount).toFixed(2),
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            address: address || 'Colombo',
            city: city || 'Colombo',
            country: country || 'Sri Lanka',
            hash: hash,
            custom_1: transaction._id.toString(),
            custom_2: ngoId
        },
    };
};

/**
 * Verify PayHere MD5 signature
 */
const verifyPayHereSignature = (
    merchantId,
    orderId,
    amount,
    currency,
    statusCode,
    md5sig,
    merchantSecret
) => {
    const formattedAmount = parseFloat(amount).toFixed(2);
    const msec = merchantSecret.toString().trim();
    const secretHash = crypto.createHash("md5").update(msec).digest("hex").toUpperCase();
    
    const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${statusCode}${secretHash}`;
    const localHash = crypto
        .createHash("md5")
        .update(hashString)
        .digest("hex")
        .toUpperCase();

    return localHash === md5sig;
};

/**
 * Manual verification for Dev/Sandbox (when localhost is unreachable by webhook)
 */
export const manualVerify = async (transactionId) => {
    const transaction = await transactionRepository.findById(transactionId);
    if (!transaction) throw new Error("Transaction not found");
    
    // Only verify if still pending
    if (transaction.status === 'pending') {
        const transactionService = await import('./transaction.service.js');
        return await transactionService.completeDonation(
            transactionId, 
            'MANUAL_DEV_VERIFY_' + Date.now(), 
            'completed'
        );
    }
    return transaction;
};

/**
 * Handle PayHere payment callback/webhook
 */
export const handlePayHereCallback = async (callbackData) => {
    if (!callbackData || typeof callbackData !== "object") {
        throw new Error("Missing callback data");
    }

    const {
        merchant_id,
        order_id,
        payment_id,
        payhere_amount,
        payhere_currency,
        status_code,
        md5sig,
        custom_1, // transaction ID
        custom_2, // ngo ID
    } = callbackData;

    if (!merchant_id || !order_id || !payhere_amount || !payhere_currency || !status_code || !md5sig) {
        throw new Error("Invalid callback data");
    }

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    // Verify signature (skip in dev mode)
    if (!isDevMode) {
        if (!md5sig) throw new Error("Missing MD5 signature");
        const isValidSignature = verifyPayHereSignature(
            merchant_id,
            order_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
            merchantSecret
        );
        if (!isValidSignature) {
            throw new Error("Invalid PayHere signature");
        }
    } else {
        console.log("Dev mode: skipping PayHere signature verification");
    }

    // Find transaction by order ID
    const transaction = await transactionRepository.findByPayHereOrderId(order_id);

    if (!transaction) {
        throw new Error(`Transaction not found for order ID: ${order_id}`);
    }

    // Update transaction status based on PayHere status code
    let newStatus = "pending";
    if (status_code === "2") {
        newStatus = "completed";
    } else if (status_code === "-1" || status_code === "-2" || status_code === "-3") {
        newStatus = "failed";
    }

    // Handle transaction completion logic (campaign updates, donor stats, trust scores)
    const finalizedTransaction = await transactionService.completeDonation(
        transaction._id,
        payment_id,
        newStatus
    );

    return {
        success: true,
        transaction: finalizedTransaction,
        status: finalizedTransaction.status,
    };
};

/**
 * Get PayHere sandbox configuration
 */
export const getPayHereConfig = () => {
    return {
        merchantId: process.env.PAYHERE_MERCHANT_ID,
        sandboxUrl: "https://sandbox.payhere.lk/pay/checkout",
        productionUrl: "https://www.payhere.lk/pay/checkout",
        mode: process.env.PAYHERE_MODE || "sandbox",
    };
};
