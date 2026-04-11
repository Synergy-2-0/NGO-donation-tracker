import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const revertIt = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Agreement = (await import('./src/models/agreement.model.js')).default;
        
        const agreements = await Agreement.find({ _id: "69da3f6b4e5ec307a2c7be23" });
        for (let ag of agreements) {
            let modified = false;
            for (let m of ag.initialMilestones) {
                if (m.title === 'Main Execution Phase' || m.title === 'Final Review & Handover') {
                    m.status = 'in-progress'; // Wait, let's just make it in-progress again as they were before
                    modified = true;
                    console.log(`Reverted status on milestone ${m.title}`);
                }
            }
            if (modified) {
                ag.markModified('initialMilestones');
                await ag.save({ validateBeforeSave: false });
                console.log(`Saved agreement ${ag._id}`);
            }
        }
        console.log("Reverted the non-paid ones back.");
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
};

revertIt();
