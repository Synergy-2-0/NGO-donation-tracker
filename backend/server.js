import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

import './src/config/db.js';
import router from './src/routes/partners.routes.js';
import campaignRoutes from "./src/routes/campaign.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import agreementRoutes from './src/routes/agreement.routes.js';
import milestoneRoutes from './src/routes/milestone.routes.js';
import financeRoutes from "./src/routes/finance.routes.js";
import donorRoutes from './src/routes/donor.routes.js';
import transparencyRoutes from './src/routes/transparency.routes.js';
import geoRoutes from './src/routes/geo.routes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use('/public', express.static('public'));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  credentials: true,
  exposedHeaders: ['set-cookie'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/partners', router);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/finance", financeRoutes);
app.use('/api/public', transparencyRoutes);
app.use('/api/geo', geoRoutes);

app.get('/', (req, res) => {
  res.status(200).send('NGO Donation Tracker API is running');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});