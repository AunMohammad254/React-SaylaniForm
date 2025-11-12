import express from 'express';
import { body } from 'express-validator';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

const courseValidation = [
  body('code')
    .isLength({ min: 2, max: 20 })
    .withMessage('Course code must be between 2 and 20 characters'),
  body('name')
    .isLength({ min: 5, max: 100 })
    .withMessage('Course name must be between 5 and 100 characters'),
  body('description')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('duration')
    .isLength({ min: 2, max: 50 })
    .withMessage('Duration must be between 2 and 50 characters'),
  body('fees')
    .isNumeric({ min: 0 })
    .withMessage('Fees must be a positive number'),
  body('schedule')
    .isArray({ min: 1 })
    .withMessage('At least one schedule entry is required'),
  body('schedule.*.day')
    .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    .withMessage('Invalid day'),
  body('schedule.*.startTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid start time format (HH:MM)'),
  body('schedule.*.endTime')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid end time format (HH:MM)'),
  body('instructor')
    .isLength({ min: 2, max: 100 })
    .withMessage('Instructor name must be between 2 and 100 characters'),
  body('campus')
    .isLength({ min: 2, max: 100 })
    .withMessage('Campus must be between 2 and 100 characters'),
  body('city')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('maxStudents')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Max students must be between 1 and 1000')
];

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', authenticate, authorize('admin', 'super-admin'), courseValidation, createCourse);
router.put('/:id', authenticate, authorize('admin', 'super-admin'), courseValidation, updateCourse);
router.delete('/:id', authenticate, authorize('admin', 'super-admin'), deleteCourse);

export default router;