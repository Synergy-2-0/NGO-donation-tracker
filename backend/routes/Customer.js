const router = require("express").Router();
const customerController = require("../controllers/Customer"); // Import the customer controller

// Define route for registering a new customer
router.post("/register", customerController.registerCustomer);

module.exports = router;