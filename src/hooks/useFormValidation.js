import { useState, useCallback, useMemo } from 'react';
import { validateEmail, validatePhone, validateCNIC } from '../utils/validation';

/**
 * Validation rules configuration
 * Each rule has a validator function and error message
 */
const VALIDATION_RULES = {
  required: (value) => ({
    isValid: value !== undefined && value !== null && String(value).trim() !== '',
    message: 'This field is required',
  }),
  
  email: (value) => ({
    isValid: !value || validateEmail(value),
    message: 'Please enter a valid email address',
  }),
  
  phone: (value) => ({
    isValid: !value || validatePhone(value),
    message: 'Please enter a valid phone number (e.g., +92 300 1234567)',
  }),
  
  cnic: (value) => ({
    isValid: !value || validateCNIC(value),
    message: 'Please enter a valid CNIC (e.g., 12345-1234567-1)',
  }),
  
  minLength: (min) => (value) => ({
    isValid: !value || String(value).length >= min,
    message: `Must be at least ${min} characters`,
  }),
  
  maxLength: (max) => (value) => ({
    isValid: !value || String(value).length <= max,
    message: `Must be no more than ${max} characters`,
  }),
  
  pattern: (regex, message) => (value) => ({
    isValid: !value || regex.test(value),
    message: message || 'Invalid format',
  }),
  
  date: (value) => ({
    isValid: !value || !isNaN(new Date(value).getTime()),
    message: 'Please enter a valid date',
  }),
  
  futureDate: (value) => ({
    isValid: !value || new Date(value) > new Date(),
    message: 'Date must be in the future',
  }),
  
  pastDate: (value) => ({
    isValid: !value || new Date(value) < new Date(),
    message: 'Date must be in the past',
  }),
  
  age: (minAge) => (value) => {
    if (!value) return { isValid: true, message: '' };
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return {
      isValid: age >= minAge,
      message: `You must be at least ${minAge} years old`,
    };
  },
};

/**
 * Field-specific validation configurations
 */
const FIELD_VALIDATIONS = {
  fullName: ['required', VALIDATION_RULES.minLength(2), VALIDATION_RULES.maxLength(100)],
  fatherName: ['required', VALIDATION_RULES.minLength(2), VALIDATION_RULES.maxLength(100)],
  email: ['required', 'email'],
  phone: ['required', 'phone'],
  cnic: ['required', 'cnic'],
  fatherCnic: ['cnic'], // Optional but must be valid if provided
  dob: ['required', 'date', 'pastDate', VALIDATION_RULES.age(10)],
  gender: ['required'],
  country: ['required'],
  city: ['required'],
  course: ['required'],
  classPreference: ['required'],
  address: ['required', VALIDATION_RULES.minLength(10), VALIDATION_RULES.maxLength(500)],
  hasLaptop: ['required'],
  lastQualification: ['required'],
};

/**
 * Custom hook for form validation with comprehensive features
 * @param {Object} initialState - Initial form data
 * @param {Object} customValidations - Custom validation rules per field
 * @returns {Object} Form state, handlers, and validation utilities
 */
export function useFormValidation(initialState = {}, customValidations = {}) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback((name, value) => {
    const validations = customValidations[name] || FIELD_VALIDATIONS[name] || [];
    
    for (const validation of validations) {
      let result;
      
      if (typeof validation === 'string') {
        // Built-in validation rule
        const rule = VALIDATION_RULES[validation];
        if (rule) {
          result = rule(value);
        }
      } else if (typeof validation === 'function') {
        // Custom validation function
        result = validation(value);
      }
      
      if (result && !result.isValid) {
        return result.message;
      }
    }
    
    return '';
  }, [customValidations]);

  /**
   * Handle input change with validation
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    
    let newValue;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'file') {
      newValue = files?.[0] || null;
    } else {
      newValue = value;
    }
    
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  /**
   * Handle input blur - mark as touched and validate
   */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, [validateField]);

  /**
   * Validate all fields
   */
  const validateAll = useCallback(() => {
    const newErrors = {};
    const allTouched = {};
    
    Object.keys(formData).forEach((name) => {
      allTouched[name] = true;
      const error = validateField(name, formData[name]);
      if (error) {
        newErrors[name] = error;
      }
    });
    
    setTouched(allTouched);
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialState]);

  /**
   * Set a specific field value
   */
  const setFieldValue = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Set a specific field error
   */
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  /**
   * Check if form is valid
   */
  const isValid = useMemo(() => {
    return Object.values(errors).every((error) => !error);
  }, [errors]);

  /**
   * Check if form has been modified
   */
  const isDirty = useMemo(() => {
    return Object.keys(touched).length > 0;
  }, [touched]);

  /**
   * Get field props for easy integration
   */
  const getFieldProps = useCallback((name) => ({
    name,
    value: formData[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
    touched: touched[name],
  }), [formData, errors, touched, handleChange, handleBlur]);

  return {
    // State
    formData,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    
    // Handlers
    handleChange,
    handleBlur,
    validateField,
    validateAll,
    resetForm,
    
    // Setters
    setFormData,
    setErrors,
    setTouched,
    setIsSubmitting,
    setFieldValue,
    setFieldError,
    
    // Utilities
    getFieldProps,
  };
}

export { VALIDATION_RULES, FIELD_VALIDATIONS };
export default useFormValidation;
