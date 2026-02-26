import 'dotenv/config'; // load env first
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(userRoutes); // register user-related endpoints (register, login, etc.)

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Add MONGO_URI to your .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});