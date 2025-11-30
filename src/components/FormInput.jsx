import { memo, useMemo, useId } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

/**
 * Helper text configuration for specific fields
 */
const HELPER_TEXTS = {
  cnic: 'Format: 12345-1234567-1',
  phone: 'Include country code (e.g., +92 300 1234567)',
  email: "We'll use this for important notifications",
  file: 'Supported formats: JPG, PNG, PDF. Max size: 2MB',
};

/**
 * FormInput Component
 * A reusable, accessible form input component with validation support
 * Memoized for performance optimization
 */
function FormInput({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  onBlur,
  error, 
  placeholder,
  options = [],
  optional = false,
  disabled = false,
  required = false,
  className = '',
  helperText,
  autoComplete,
}) {
  // Generate unique ID for accessibility
  const generatedId = useId();
  const inputId = `${name}-${generatedId}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  
  const isSelect = options.length > 0;
  const hasError = Boolean(error);
  const showHelperText = !hasError && (helperText || HELPER_TEXTS[name] || (type === 'file' && HELPER_TEXTS.file));

  // Memoize base classes to avoid recalculation
  const baseClasses = useMemo(() => `
    w-full 
    touch-target
    px-3 sm:px-4 
    py-3 sm:py-3.5 
    text-base
    border-2 
    rounded-lg 
    transition-all duration-200 
    focus:outline-none 
    focus:ring-2 
    disabled:bg-gray-50 
    disabled:cursor-not-allowed 
    disabled:opacity-60
    ${hasError 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
      : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white hover:border-green-400'
    }
  `.trim(), [hasError]);

  // Determine autocomplete value
  const autoCompleteValue = useMemo(() => {
    if (autoComplete) return autoComplete;
    
    const autoCompleteMap = {
      email: 'email',
      tel: 'tel',
      fullName: 'name',
      phone: 'tel',
      dob: 'bday',
      address: 'street-address',
    };
    
    return autoCompleteMap[type] || autoCompleteMap[name] || 'off';
  }, [autoComplete, type, name]);

  // Common props for input elements
  const commonProps = {
    id: inputId,
    name,
    disabled,
    required,
    className: `${baseClasses} ${className}`,
    style: { fontSize: '16px' }, // Prevent iOS zoom
    'aria-invalid': hasError,
    'aria-describedby': hasError ? errorId : showHelperText ? helperId : undefined,
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label 
        htmlFor={inputId}
        className="block text-sm sm:text-base font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        )}
        {required && <span className="sr-only">(required)</span>}
        {optional && (
          <span className="text-gray-400 ml-1 text-xs font-normal">(Optional)</span>
        )}
      </label>

      {/* Input Field Container */}
      <div className="relative">
        {isSelect ? (
          /* Select Dropdown */
          <div className="relative">
            <select
              {...commonProps}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className={`${commonProps.className} appearance-none cursor-pointer pr-10`}
            >
              <option value="" disabled>
                {placeholder || `Select ${label.toLowerCase()}`}
              </option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            
            {/* Custom dropdown arrow */}
            <div 
              className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
              aria-hidden="true"
            >
              <ChevronDown 
                size={20} 
                className={`transition-colors duration-200 ${
                  hasError ? 'text-red-500' : 'text-gray-400'
                }`}
              />
            </div>
          </div>
        ) : (
          /* Input Fields */
          <input
            {...commonProps}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder || label}
            autoComplete={autoCompleteValue}
          />
        )}

        {/* Error Icon for non-select inputs */}
        {hasError && !isSelect && (
          <div 
            className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
            aria-hidden="true"
          >
            <AlertCircle size={20} className="text-red-500" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <div 
          id={errorId}
          className="flex items-start gap-2 text-red-600 text-sm"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {showHelperText && (
        <p 
          id={helperId}
          className="text-xs sm:text-sm text-gray-500"
        >
          {helperText || HELPER_TEXTS[name] || HELPER_TEXTS.file}
        </p>
      )}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(FormInput);