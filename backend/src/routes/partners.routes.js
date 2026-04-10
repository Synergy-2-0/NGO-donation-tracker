import express from 'express';
import * as ctrl from '../controllers/partners.controller.js';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createPartnerSchema, updatePartnerSchema } from '../validators/partner.validator.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('partner'), validateRequest(createPartnerSchema), ctrl.createPartnership);
router.post('/upload-logo', authenticate, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = req.file.path || req.file.secure_url || req.file.url || null;
    if (!fileUrl) {
      return res.status(500).json({ message: 'Upload completed, but no file URL was returned' });
    }

    console.log('Logo uploaded successfully:', fileUrl);
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('LOGO UPLOAD ERROR:', error);
    res.status(500).json({
      message: 'Logo upload failed',
      details: error.message || error
    });
  }
});

router.post('/upload-document', authenticate, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document uploaded' });
    }

    const fileUrl = req.file.path || req.file.secure_url || req.file.url || null;
    if (!fileUrl) {
      return res.status(500).json({ message: 'Upload completed, but no file URL was returned' });
    }

    console.log('Document uploaded successfully:', fileUrl);
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('DOCUMENT UPLOAD ERROR:', error);
    res.status(500).json({
      message: 'Document upload failed',
      details: error.message || error
    });
  }
});
router.get('/', optionalAuthenticate, ctrl.getPartners);
router.get('/me/profile', authenticate, ctrl.getMyPartnerProfile);
router.get('/:id/impact', optionalAuthenticate, ctrl.getPartnerImpact);
router.get('/:id', optionalAuthenticate, ctrl.getPartner);
router.put('/:id', authenticate, validateRequest(updatePartnerSchema), ctrl.updatePartner);
router.patch('/:id/approve', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.approvePartner);
router.delete('/:id', authenticate, ctrl.deletePartner);

export default router;