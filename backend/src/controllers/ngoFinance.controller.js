import * as ngoFinanceService from '../services/ngoFinance.service.js';

export const getLedger = async (req, res) => {
  try {
    const ledger = await ngoFinanceService.getNGOLedger(req.user.id);
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const allocate = async (req, res) => {
  try {
    const result = await ngoFinanceService.allocateFunds(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMetrics = async (req, res) => {
  try {
    const metrics = await ngoFinanceService.getNGOMetrics(req.user.id);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
