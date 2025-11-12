import express from 'express';
import { body } from 'express-validator';
import {
  createRegistration,
  getMyRegistration,
  updateRegistration,
  getRegistrationStatus
} from '../controllers/registrationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const registrationValidation = [
  body('personalInfo.fullName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('personalInfo.fatherName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Father name must be between 2 and 100 characters'),
  body('personalInfo.cnic')
    .matches(/^[0-9]{13}$/)
    .withMessage('CNIC must be 13 digits'),
  body('personalInfo.dateOfBirth')
    .isISO8601()
    .withMessage('Valid date of birth is required'),
  body('personalInfo.gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('personalInfo.phone')
    .matches(/^[0-9]{10,15}$/)
    .withMessage('Phone number must be 10-15 digits'),
  body('personalInfo.address')
    .isLength({ min: 5, max: 500 })
    .withMessage('Address must be between 5 and 500 characters'),
  body('personalInfo.city')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('personalInfo.country')
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
  body('educationalBackground.lastQualification')
    .isLength({ min: 2, max: 100 })
    .withMessage('Last qualification is required'),
  body('educationalBackground.computerProficiency')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Computer proficiency must be Beginner, Intermediate, or Advanced'),
  body('educationalBackground.hasLaptop')
    .isBoolean()
    .withMessage('Laptop availability must be specified'),
  body('courseSelection.selectedCourse')
    .isMongoId()
    .withMessage('Valid course selection is required'),
  body('courseSelection.classPreference')
    .isIn(['Morning', 'Evening', 'Weekend'])
    .withMessage('Class preference must be Morning, Evening, or Weekend'),
  body('documents.profilePicture')
    .isURL()
    .withMessage('Valid profile picture URL is required')
];

router.post('/', authenticate, registrationValidation, createRegistration);
router.get('/my', authenticate, getMyRegistration);
router.put('/my', authenticate, registrationValidation, updateRegistration);
router.get('/status', authenticate, getRegistrationStatus);

export default router;