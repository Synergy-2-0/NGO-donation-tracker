import express from 'express';
import dotenv from "dotenv";

dotenv.config();

import './src/config/db.js';
import router from './src/routes/partners.routes.js';
import swaggerUi from 'swagger-ui-express';
import campaignRoutes from "./src/routes/campaign.routes.js";
import swaggerSpec from "./src/config/swagger.js";
import userRoutes from "./src/routes/user.routes.js";
import agreementRoutes from './src/routes/agreement.routes.js';
import milestoneRoutes from './src/routes/milestone.routes.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/partners', router);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/milestones', milestoneRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});