import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  getMyAttendance,
  getMyAssignments,
  getMyFees,
  getMySchedule
} from '../controllers/studentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticate, getMyProfile);
router.put('/profile', authenticate, updateMyProfile);
router.get('/attendance', authenticate, getMyAttendance);
router.get('/assignments', authenticate, getMyAssignments);
router.get('/fees', authenticate, getMyFees);
router.get('/schedule', authenticate, getMySchedule);

export default router;