import { AlertCircle, ChevronDown } from 'lucide-react';

export default function FormInput({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  error, 
  placeholder,
  options = [], // For select dropdowns
  optional = false,
  disabled = false,
  required = false
}) {
  const isSelect = options.length > 0;
  const inputId = `${name}-${Math.random().toString(36).substr(2, 9)}`;

  // Base classes for all form elements
  const baseClasses = `
    w-full 
    touch-target
    px-3 sm:px-4 
    py-3 sm:py-3.5 
    text-base sm:text-lg
    border-2 
    rounded-lg 
    transition-all duration-200 
    focus:outline-none 
    focus:ring-2 
    focus:ring-green-500/20 
    focus:border-green-500
    disabled:bg-gray-50 
    disabled:cursor-not-allowed 
    disabled:opacity-60
    ${error 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
      : 'border-gray-300 focus:border-green-500 bg-white hover:border-green-400'
    }
  `;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label 
        htmlFor={inputId}
        className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {optional && <span className="text-gray-400 ml-1 text-xs">(Optional)</span>}
      </label>

      {/* Input Field Container */}
      <div className="relative">
        {isSelect ? (
          /* Select Dropdown */
          <div className="relative">
            <select
              id={inputId}
              name={name}
              value={value}
              onChange={onChange}
              disabled={disabled}
              required={required}
              className={`${baseClasses} appearance-none cursor-pointer pr-10`}
              style={{ fontSize: '16px' }} // Prevent iOS zoom
            >
              <option value="" disabled>
                {placeholder || `Select ${label.toLowerCase()}`}
              </option>
              {options.map((opt, index) => (
                <option key={`${opt}-${index}`} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown 
                size={20} 
                className={`transition-colors duration-200 ${
                  error ? 'text-red-500' : 'text-gray-400'
                }`}
              />
            </div>
          </div>
        ) : (
          /* Input Fields */
          <input
            id={inputId}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || label}
            disabled={disabled}
            required={required}
            className={baseClasses}
            style={{ fontSize: '16px' }} // Prevent iOS zoom
            autoComplete={
              type === 'email' ? 'email' : 
              type === 'tel' ? 'tel' : 
              name === 'fullName' ? 'name' :
              name === 'phone' ? 'tel' :
              name === 'dob' ? 'bday' :
              'off'
            }
          />
        )}

        {/* Error Icon */}
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <AlertCircle 
              size={20} 
              className="text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="flex items-start gap-2 text-red-600 text-sm mt-2"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text for specific fields */}
      {!error && (
        <>
          {name === 'cnic' && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Format: 12345-1234567-1
            </p>
          )}
          {name === 'phone' && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Include country code (e.g., +92 300 1234567)
            </p>
          )}
          {name === 'email' && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              We'll use this for important notifications
            </p>
          )}
          {type === 'file' && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Supported formats: JPG, PNG, PDF. Max size: 2MB
            </p>
          )}
        </>
      )}
    </div>
  );
}