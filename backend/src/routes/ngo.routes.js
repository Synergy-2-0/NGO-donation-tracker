import express from 'express';
import * as ngoController from '../controllers/ngo.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/upload-logo', authenticate, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('NGO LOGO UPLOAD ERROR:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

router.post('/upload-document', authenticate, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No document uploaded' });
    const fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('NGO DOC UPLOAD ERROR:', error);
    res.status(500).json({ message: 'Document upload failed', error: error.message });
  }
});

// Publicly visible NGO data
router.get('/public', ngoController.getAll);

// Authenticated Routes
router.use(authenticate);

// Profile Management
router.post('/register', ngoController.register);
router.get('/profile', ngoController.getProfile);
router.patch('/profile', ngoController.updateProfile);

// Admin Specific Routes (Approve/Reject NGOs)
router.get('/', authorizeRoles('admin'), ngoController.getAll);
router.get('/all', authorizeRoles('admin'), ngoController.getAll);
router.patch('/:id/approve', authorizeRoles('admin'), ngoController.approve);
router.patch('/:id/reject', authorizeRoles('admin'), ngoController.reject);
router.get('/:id/trust-score', ngoController.getTrustScore);

export default router;
