import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  uploadProfile,
  deleteProfile,
  uploadMiddleware
} from '../controllers/uploadController.js';

const router = express.Router();

router.post('/profile', authenticate, uploadMiddleware, uploadProfile);
router.delete('/profile', authenticate, deleteProfile);

export default router;