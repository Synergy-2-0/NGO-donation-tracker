import Transaction from '../models/transaction.model.js';
import NGO from '../models/ngo.model.js';
import Campaign from '../models/campaign.model.js';

export const getNGOLedger = async (userId) => {
  const ngo = await NGO.findOne({ userId });
  if (!ngo) throw new Error('NGO profile not found');

  return await Transaction.find({ ngoId: ngo._id, status: 'completed' })
    .populate('donorId', 'name email')
    .populate('campaignId', 'title')
    .sort({ createdAt: -1 });
};

export const allocateFunds = async (userId, allocationData) => {
  const { campaignId, amount, type } = allocationData;
  const ngo = await NGO.findOne({ userId });
  if (!ngo) throw new Error('NGO profile not found');

  if (ngo.availableFunds < amount) {
    throw new Error('Insufficient funds in NGO treasury');
  }

  // Deduct from NGO available funds
  ngo.availableFunds -= amount;
  await ngo.save();

  // If allocated to a campaign, update campaign raised amount (or a separate allocation field)
  if (type === 'campaign' && campaignId) {
    await Campaign.findByIdAndUpdate(campaignId, { $inc: { raisedAmount: amount } });
  }

  // Create an internal transaction log (optional, but good for audit)
  // In a real system, we'd have a separate InternalAllocation model
  return { success: true, remainingFunds: ngo.availableFunds };
};

export const getNGOMetrics = async (userId) => {
  const ngo = await NGO.findOne({ userId });
  if (!ngo) throw new Error('NGO profile not found');

  const transactions = await Transaction.find({ ngoId: ngo._id, status: 'completed' })
    .populate('campaignId', 'category title')
    .sort({ createdAt: -1 });

  const totalRaised = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const donorCount = new Set(transactions.map(tx => tx.donorId.toString())).size;

  // Aggregate category metrics
  const donationsByCategory = transactions.reduce((acc, tx) => {
    const cat = tx.campaignId?.category || 'General Mission';
    acc[cat] = (acc[cat] || 0) + tx.amount;
    return acc;
  }, {});

  // Recent activity logs (for admin/finance activity widgets)
  const recentActivity = transactions.slice(0, 8).map(tx => ({
    _id: tx._id,
    amount: tx.amount,
    title: tx.campaignId?.title || 'General Support',
    category: tx.campaignId?.category || 'Mission',
    date: tx.createdAt
  }));

  return {
    availableFunds: ngo.availableFunds,
    totalRaised,
    donorCount,
    trustScore: ngo.trustScore,
    status: ngo.status,
    donationsByCategory,
    recentActivity
  };
};
