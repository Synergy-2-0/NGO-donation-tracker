import { Router } from 'express';
import customerController from '../controllers/Partnership.js'; // Import the customer controller

const router = Router();

// Define route for registering a new customer
router.post('/register', customerController.registerCustomer);

export default router;