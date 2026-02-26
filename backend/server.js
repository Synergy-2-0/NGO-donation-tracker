import express from 'express';
import dotenv from "dotenv";
import './src/config/db.js';
import router from './src/routes/partners.routes.js';
import campaignRoutes from "./src/routes/campaign.routes.js";
import financeRoutes from "./src/routes/finance.routes.js";
import donorRoutes from './src/routes/donor.routes.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup routes
app.use('/api/partners', router);

app.use("/api/campaigns", campaignRoutes);
app.use("/api/donors", donorRoutes);

app.use("/api/finance", financeRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});