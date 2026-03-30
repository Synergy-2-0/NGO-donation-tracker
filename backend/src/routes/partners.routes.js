import express from 'express';
import * as ctrl from '../controllers/partners.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { createPartnerSchema, updatePartnerSchema } from '../validators/partner.validator.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('partner'), validateRequest(createPartnerSchema), ctrl.createPartnership);
router.post('/upload-logo', authenticate, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('Upload Error: No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Construct local URL
    const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
    
    console.log('File uploaded locally successfully:', fileUrl);
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('LOCAL UPLOAD ERROR:', error);
    res.status(500).json({ 
      message: 'Local upload failed', 
      details: error.message || error
    });
  }
});

router.post('/upload-document', authenticate, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('Document Upload Error: No file in request');
      return res.status(400).json({ message: 'No document uploaded' });
    }
    
    // Construct local URL for document
    const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
    
    console.log('Document uploaded locally successfully:', fileUrl);
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('LOCAL DOCUMENT UPLOAD ERROR:', error);
    res.status(500).json({ 
      message: 'Document upload failed', 
      details: error.message || error
    });
  }
});
router.get('/', authenticate, ctrl.getPartners);
router.get('/me/profile', authenticate, ctrl.getMyPartnerProfile);
router.get('/:id/impact', authenticate, ctrl.getPartnerImpact);
router.get('/:id', authenticate, ctrl.getPartner);
router.put('/:id', authenticate, validateRequest(updatePartnerSchema), ctrl.updatePartner);
router.patch('/:id/approve', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.approvePartner);
router.delete('/:id', authenticate, ctrl.deletePartner);

export default router;