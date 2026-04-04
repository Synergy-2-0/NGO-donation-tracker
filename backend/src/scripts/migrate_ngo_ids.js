import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NGO from '../models/ngo.model.js';
import Transaction from '../models/transaction.model.js';

dotenv.config();

async function migrate() {
    try {
        const uri = (process.env.MONGO_URI || process.env.MONGODB_URI).trim().replace(/'/g, '');
        await mongoose.connect(uri);
        
        const ngos = await NGO.find({});
        console.info(`Found ${ngos.length} NGO documents in the registry Hub`);
        
        for (const ngo of ngos) {
            console.info(`Synchronizing Transactions for NGO: ${ngo.organizationName} (${ngo._id})`);
            
            // Fix: Map User ID references to correct NGO Document ID
            const result = await Transaction.updateMany(
                { ngoId: ngo.userId },
                { $set: { ngoId: ngo._id } }
            );
            
            console.info(`Updated ${result.modifiedCount} high-fidelity transactions Hub`);
            
            // Bonus Fix: Ensure they are marked Completed if they was in a dev state (Optional but helpful for visibility)
            // const verifyResult = await Transaction.updateMany(
            //     { ngoId: ngo._id, status: 'pending' },
            //     { $set: { status: 'completed' } }
            // );
            // console.info(`Auto-Verified ${verifyResult.modifiedCount} pending income streams Hub`);
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Migration Aborted:', err.message);
        process.exit(1);
    }
}

migrate();
