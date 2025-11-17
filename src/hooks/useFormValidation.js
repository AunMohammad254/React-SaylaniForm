import { useState } from 'react';

export function useFormValidation(initialState) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    // Your validation logic
    switch (name) {
      case 'email':
        return validateEmail(value) ? '' : 'Invalid email format';
      case 'phone':
        return validatePhone(value) ? '' : 'Invalid phone number format';
      case 'cnic':
        return validateCNIC(value) ? '' : 'Invalid CNIC format';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return { formData, errors, handleChange, setFormData, setErrors };
}