import express from 'express';
import { body } from 'express-validator';
import {
  getAllStudents,
  getStudentById,
  updateStudentStatus,
  getDashboardStats,
  exportStudents
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

const statusUpdateValidation = [
  body('status')
    .isIn(['pending', 'approved', 'rejected', 'enrolled'])
    .withMessage('Status must be pending, approved, rejected, or enrolled'),
  body('enrollment.batchNumber')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Batch number must be between 1 and 50 characters'),
  body('enrollment.rollNumber')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Roll number must be between 1 and 50 characters'),
  body('enrollment.campus')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Campus must be between 2 and 100 characters')
];

router.get('/students', authenticate, authorize('admin', 'super-admin'), getAllStudents);
router.get('/students/:id', authenticate, authorize('admin', 'super-admin'), getStudentById);
router.put('/students/:id/status', authenticate, authorize('admin', 'super-admin'), statusUpdateValidation, updateStudentStatus);
router.get('/dashboard', authenticate, authorize('admin', 'super-admin'), getDashboardStats);
router.get('/export', authenticate, authorize('admin', 'super-admin'), exportStudents);

export default router;