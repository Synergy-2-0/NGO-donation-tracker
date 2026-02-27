import express from 'express';
import dotenv from "dotenv";
import './src/config/db.js';
import router from './src/routes/partners.routes.js';
import campaignRoutes from "./src/routes/campaign.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import agreementRoutes from './src/routes/agreement.routes.js';
import milestoneRoutes from './src/routes/milestone.routes.js';
import financeRoutes from "./src/routes/finance.routes.js";
import donorRoutes from './src/routes/donor.routes.js';
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/partners', router);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/finance", financeRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});