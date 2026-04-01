import cron from 'node-cron';
import * as donorRepository from '../repository/donor.repository.js';
import * as transactionRepository from '../repository/transaction.repository.js';
import { sendPledgeReminder } from './email.service.js';

// Run every day at 09:00 AM
export const initReminderJob = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('--- STARTING PLEDGE REMINDER CYCLE ---');
    try {
      const donors = await donorRepository.findAllPledgers({ pledgeStatus: 'active' });
      
      for (const donor of donors) {
        if (!donor.pledges || donor.pledges.length === 0) continue;
        
        const userEmail = donor.userId?.email;
        if (!userEmail) continue;

        for (const pledge of donor.pledges) {
          if (pledge.status !== 'active') continue;

          const pledgeTxs = await transactionRepository.findAll({
            donorId: donor.userId?._id || donor.userId,
            campaignId: pledge.campaign?._id || pledge.campaign,
            status: 'completed'
          });

          const months = pledge.frequency === 'monthly' ? 1 : pledge.frequency === 'quarterly' ? 3 : pledge.frequency === 'annually' ? 12 : 0;
          if (!months) continue;

          let nextDate;
          if (pledgeTxs.length > 0) {
            const sortedTxs = [...pledgeTxs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            nextDate = new Date(sortedTxs[0].createdAt);
            nextDate.setMonth(nextDate.getMonth() + months);
          } else {
            nextDate = new Date(pledge.startDate || pledge.createdAt);
          }

          // Check if nextDate is tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);

          const checkDate = new Date(nextDate);
          checkDate.setHours(0, 0, 0, 0);

          if (checkDate.getTime() === tomorrow.getTime()) {
            console.log(`Sending reminder to ${userEmail} for pledge ${pledge._id}`);
            await sendPledgeReminder(userEmail, pledge, nextDate);
          }
        }
      }
    } catch (error) {
      console.error('Reminder Engine Failure:', error);
    }
    console.log('--- REMINDER CYCLE COMPLETE ---');
  });
};
