import crypto from "crypto";
import * as transactionService from "./transaction.service.js";
import * as transactionRepository from "../repository/transaction.repository.js";

const isDevMode = process.env.NODE_ENV !== "production";
/**
 * Generate MD5 hash for PayHere
 */
const generateHash = (merchantId, orderId, amount, currency, merchantSecret) => {
    const formattedAmount = parseFloat(amount).toFixed(2);
    const secretHash = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();
    const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${secretHash}`;
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

    // Generate unique order ID
    const orderId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get PayHere credentials from environment
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchantId || !merchantSecret) {
        throw new Error("PayHere credentials not configured");
    }

    // Generate hash
    const hash = generateHash(merchantId, orderId, amount, currency, merchantSecret);

    // Create pending transaction
    const transaction = await transactionService.createTransaction({
        donorId,
        ngoId,
        campaignId,
        amount,
        currency,
        status: "pending",
        payHereOrderId: orderId,
        paymentMethod: "PayHere",
    });

    // Return PayHere payment initialization data
    return {
        transactionId: transaction._id,
        paymentData: {
            merchant_id: merchantId,
            return_url: process.env.PAYHERE_RETURN_URL || "http://localhost:3000/payment/return",
            cancel_url: process.env.PAYHERE_CANCEL_URL || "http://localhost:3000/payment/cancel",
            notify_url: process.env.PAYHERE_NOTIFY_URL || "http://localhost:3000/api/finance/payhere/callback",
            order_id: orderId,
            items: `Donation to NGO`,
            currency,
            amount: parseFloat(amount).toFixed(2),
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            address: address || "",
            city: city || "",
            country: country || "Sri Lanka",
            hash,
            custom_1: transaction._id.toString(), // Store transaction ID
            custom_2: ngoId,
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
    const hashString = `${merchantId}${orderId}${formattedAmount}${currency}${statusCode}${merchantSecret}`;
    const localHash = crypto
        .createHash("md5")
        .update(hashString)
        .digest("hex")
        .toUpperCase();

    return localHash === md5sig;
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

    // Update transaction
    const updatedTransaction = await transactionRepository.updateById(transaction._id, {
        status: newStatus,
        paymentId: payment_id,
        notes: `PayHere status code: ${status_code} ${isDevMode ? "(Dev: signature skipped)" : ""}`,
    });


    return {
        success: true,
        transaction: updatedTransaction,
        status: newStatus,
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
