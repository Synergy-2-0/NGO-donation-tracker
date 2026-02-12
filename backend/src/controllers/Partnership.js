import Customer from '../model/Partnership.js';

// Controller function to register a new customer
const registerCustomer = async (req, res) => {
    try {
        const { email, name, age } = req.body;

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({
                message: "Customer already exists with this email."
            });
        }

        const newCustomer = new Customer({ email, name, age });
        await newCustomer.save();

        res.status(201).json({
            message: "Customer registered successfully.",
            customer: newCustomer
        });
    } catch (error) {
        console.error("Error registering customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { registerCustomer };
