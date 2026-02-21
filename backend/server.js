import express from 'express';
import dotenv from "dotenv";
import './src/config/db.js';
import router from './src/routes/partners.routes.js';
// import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import campaignRoutes from "./src/routes/campaign.routes.js";
import swaggerSpec from "./src/config/swagger.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Setup routes
app.use('/api/partners', router);

app.use("/api/campaigns", campaignRoutes);

// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Partnerships & Transparency API',
//       version: '1.0.0',
//       description: 'RESTful API for CSR/NGO partnerships, transparency dashboard, AI matching, and geo map (SE3040 Assignment 2026)',
//       contact: {
//         name: 'Luqman (Group Member)',
//       },
//     },
//     servers: [
//       {
//         url: `http://localhost:${port}`,
//         description: 'Development server',
//       },
//       // Add production URL later (e.g. Render/Railway)
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//         },
//       },
//     },
//     tags: [
//       {
//         name: 'Partners',
//         description: 'Partner profiles and management',
//       },
//       // Add more tags later: Agreements, Milestones, Public, etc.
//     ],
//   },
//   apis: [
//     './src/routes/*.js',          
//     './src/controllers/*.js',    
//     './src/models/partner.model.js', 
//   ],
// };

// const specs = swaggerJsdoc(swaggerOptions);

// app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
//   explorer: true,               // Enable search in UI
//   customCss: '.swagger-ui .topbar { background-color: #1a1a2e; }', 
//   customSiteTitle: 'Partnerships API Docs',
// }));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});