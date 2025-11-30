/**
 * Validation utility functions
 * Centralized validation logic for the application
 */

/**
 * Email validation regex pattern
 * Matches standard email format
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pakistan phone number regex pattern
 * Supports: +92 XXX XXXXXXX, 0XXX XXXXXXX
 */
const PHONE_REGEX = /^(\+92|0)?[0-9]{10}$/;

/**
 * CNIC regex patterns
 * Supports: XXXXX-XXXXXXX-X or 13 digits
 */
const CNIC_FORMATTED_REGEX = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
const CNIC_PLAIN_REGEX = /^[0-9]{13}$/;

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validate Pakistani phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  return PHONE_REGEX.test(cleaned);
};

/**
 * Validate CNIC (Computerized National Identity Card)
 * @param {string} cnic - CNIC to validate
 * @returns {boolean} - True if valid
 */
export const validateCNIC = (cnic) => {
  if (!cnic) return false;
  const trimmed = cnic.trim();
  return CNIC_FORMATTED_REGEX.test(trimmed) || CNIC_PLAIN_REGEX.test(trimmed);
};

/**
 * Normalize CNIC to 13-digit format
 * @param {string} cnic - CNIC to normalize
 * @returns {string} - Normalized CNIC
 */
export const normalizeCNIC = (cnic) => {
  if (!cnic) return '';
  return cnic.replace(/[-\s]/g, '');
};

/**
 * Format CNIC to XXXXX-XXXXXXX-X format
 * @param {string} cnic - CNIC to format
 * @returns {string} - Formatted CNIC
 */
export const formatCNIC = (cnic) => {
  const normalized = normalizeCNIC(cnic);
  if (normalized.length !== 13) return cnic;
  return `${normalized.slice(0, 5)}-${normalized.slice(5, 12)}-${normalized.slice(12)}`;
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} - True if not empty
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length required
 * @returns {boolean} - True if meets minimum length
 */
export const validateMinLength = (value, minLength) => {
  if (!value) return false;
  return String(value).length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length allowed
 * @returns {boolean} - True if within maximum length
 */
export const validateMaxLength = (value, maxLength) => {
  if (!value) return true;
  return String(value).length <= maxLength;
};

/**
 * Validate date of birth for age requirement
 * @param {string} dob - Date of birth string
 * @param {number} minAge - Minimum age required
 * @returns {boolean} - True if meets age requirement
 */
export const validateAge = (dob, minAge = 10) => {
  if (!dob) return false;
  
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return false;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= minAge;
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {boolean} - True if file type is allowed
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png']) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeBytes - Maximum file size in bytes
 * @returns {boolean} - True if file size is within limit
 */
export const validateFileSize = (file, maxSizeBytes = 2 * 1024 * 1024) => {
  if (!file) return false;
  return file.size <= maxSizeBytes;
};

/**
 * Comprehensive form field validator
 * @param {string} fieldName - Name of the field
 * @param {any} value - Value to validate
 * @returns {string} - Error message or empty string if valid
 */
export const getFieldError = (fieldName, value) => {
  switch (fieldName) {
    case 'email':
      if (!validateRequired(value)) return 'Email is required';
      if (!validateEmail(value)) return 'Please enter a valid email address';
      break;
      
    case 'phone':
      if (!validateRequired(value)) return 'Phone number is required';
      if (!validatePhone(value)) return 'Please enter a valid phone number';
      break;
      
    case 'cnic':
      if (!validateRequired(value)) return 'CNIC is required';
      if (!validateCNIC(value)) return 'Please enter a valid CNIC (e.g., 12345-1234567-1)';
      break;
      
    case 'fullName':
    case 'fatherName':
      if (!validateRequired(value)) return 'This field is required';
      if (!validateMinLength(value, 2)) return 'Name must be at least 2 characters';
      if (!validateMaxLength(value, 100)) return 'Name must be less than 100 characters';
      break;
      
    case 'dob':
      if (!validateRequired(value)) return 'Date of birth is required';
      if (!validateAge(value, 10)) return 'You must be at least 10 years old';
      break;
      
    default:
      if (!validateRequired(value)) return 'This field is required';
  }
  
  return '';
};

export default {
  validateEmail,
  validatePhone,
  validateCNIC,
  normalizeCNIC,
  formatCNIC,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateAge,
  validateFileType,
  validateFileSize,
  getFieldError,
};