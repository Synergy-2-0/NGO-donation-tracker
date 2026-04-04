import mongoose from 'mongoose';
import Campaign from './src/models/campaign.model.js';
import Partner from './src/models/partner.model.js';
import Transaction from './src/models/transaction.model.js';
import Milestone from './src/models/milestone.model.js';
import NGO from './src/models/ngo.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const NGOs = await NGO.find({ status: 'approved' });
    const partners = await Partner.find({ verificationStatus: 'verified', status: 'active' });
    const transactions = await Transaction.find({ status: 'completed' });
    
    console.log('NGOs (Approved):', NGOs.length);
    console.log('Partners (Verified):', partners.length);
    console.log('Transactions (Completed):', transactions.length);

    console.log('NGO Trust Scores:', NGOs.map(n => ({ name: n.organizationName, score: n.trustScore, isPublic: n.isPublic })));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();
