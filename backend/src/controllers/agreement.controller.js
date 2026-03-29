import agreementService from '../services/agreement.service.js';

export const createAgreement = async (req, res) => {
  try {
    const agreement = await agreementService.createAgreement(req.body, req.user);
    res.status(201).json(agreement);
  } catch (error) {
    const status = error.message === 'Unauthorized' ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};

export const getAgreements = async (req, res) => {
  try {
    const agreements = await agreementService.getAgreements(req.query, req.user);
    res.json(agreements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgreement = async (req, res) => {
  try {
    const agreement = await agreementService.getAgreementById(req.params.id, req.user);
    res.json(agreement);
  } catch (error) {
    const status = error.message === 'Agreement not found' ? 404 : error.message === 'Unauthorized' ? 403 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const updateAgreement = async (req, res) => {
  try {
    const agreement = await agreementService.updateAgreement(req.params.id, req.body, req.user);
    res.json(agreement);
  } catch (error) {
    const status = error.message === 'Agreement not found' ? 404 : error.message === 'Unauthorized' ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};

export const deleteAgreement = async (req, res) => {
  try {
    await agreementService.deleteAgreement(req.params.id, req.user);
    res.status(204).send();
  } catch (error) {
    const status = error.message === 'Agreement not found' ? 404 : error.message === 'Unauthorized' ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};

export const getPartnerAgreements = async (req, res) => {
  try {
    const agreements = await agreementService.getPartnerAgreements(req.params.partnerId, req.user);
    res.json(agreements);
  } catch (error) {
    const status = error.message === 'Unauthorized' ? 403 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const updateAgreementStatus = async (req, res) => {
  try {
    const agreement = await agreementService.updateStatus(req.params.id, req.body.status, req.user);
    res.json(agreement);
  } catch (error) {
    const status = error.message === 'Agreement not found' ? 404 : error.message === 'Unauthorized' ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};

export const approveAgreement = async (req, res) => {
  try {
    const agreement = await agreementService.approveAgreement(req.params.id, req.user);
    res.json(agreement);
  } catch (error) {
    const status = error.message === 'Agreement not found' ? 404 : error.message === 'Unauthorized' ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};

export const getAgreementsByCampaign = async (req, res) => {
  try {
    const agreements = await agreementService.getAgreementsByCampaign(req.params.campaignId, req.user);
    res.json(agreements);
  } catch (error) {
    const status = error.message === 'Campaign not found' ? 404 : error.message === 'Unauthorized' ? 403 : 500;
    res.status(status).json({ message: error.message });
  }
};
