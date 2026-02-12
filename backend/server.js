import express from 'express';
import './db.js';
import partnershipRouter from './routes/Partnership.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Setup routes
app.use('/api/partners', partnershipRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});