import express from 'express';
import * as ctrl from '../controllers/milestone.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import {
  createMilestoneSchema,
  milestoneQuerySchema,
  updateMilestoneSchema,
} from '../validators/milestone.validator.js';

import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('admin', 'ngo-admin', 'partner'), validateRequest(createMilestoneSchema), ctrl.createMilestone);
router.post('/upload-evidence', authenticate, upload.single('evidence'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No evidence file uploaded' });
    }
    const fileUrl = req.file.path || req.file.secure_url || req.file.url || null;
    if (!fileUrl) {
      return res.status(500).json({ message: 'Upload completed, but no file URL was returned' });
    }
    console.log('Milestone evidence uploaded:', fileUrl);
    res.json({ url: fileUrl });
  } catch (error) {
    console.error('MILESTONE UPLOAD ERROR:', error);
    res.status(500).json({ message: 'Evidence upload failed', details: error.message });
  }
});
router.get('/', authenticate, authorizeRoles('admin', 'ngo-admin', 'partner'), validateRequest(milestoneQuerySchema, 'query'), ctrl.getMilestones);
router.get('/:id', authenticate, authorizeRoles('admin', 'ngo-admin', 'partner'), ctrl.getMilestone);
router.put('/:id', authenticate, authorizeRoles('admin', 'ngo-admin', 'partner'), validateRequest(updateMilestoneSchema), ctrl.updateMilestone);
router.delete('/:id', authenticate, authorizeRoles('admin', 'ngo-admin'), ctrl.deleteMilestone);

export default router;
