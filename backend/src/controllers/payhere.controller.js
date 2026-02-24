import * as payHereService from "../services/payhere.service.js";

/**
 * Initialize PayHere payment
 * Route: POST /api/finance/payhere/init
 */
export const initPayment = async (req, res) => {
    try {
        const result = await payHereService.initPayHerePayment(req.body);
        res.status(200).json({
            success: true,
            message: "Payment initialized successfully",
            ...result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Handle PayHere payment callback (webhook)
 * Route: POST /api/finance/payhere/callback
 */
export const handleCallback = async (req, res) => {
    try {
        const result = await payHereService.handlePayHereCallback(req.body);
        res.status(200).json({
            success: true,
            message: "Payment callback processed successfully",
            ...result,
        });
    } catch (error) {
        console.error("PayHere callback error:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get PayHere configuration
 * Route: GET /api/finance/payhere/config
 */
export const getConfig = async (req, res) => {
    try {
        const config = payHereService.getPayHereConfig();
        res.status(200).json({
            success: true,
            config,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
