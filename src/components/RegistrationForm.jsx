import { useState, useCallback, memo, useMemo } from 'react';
import FormInput from './FormInput';
import { 
  COUNTRIES, 
  CLASS_PREFERENCES, 
  GENDERS, 
  CITIES, 
  COURSES,
  COMPUTER_PROFICIENCY,
  QUALIFICATIONS,
  YES_NO_OPTIONS,
  INITIAL_FORM_STATE,
} from '../constants/formOptions';
import { Upload, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ensureLookups, upsertStudent, insertRegistration } from '../utils/registrationApi';
import { useFormValidation } from '../hooks/useFormValidation';
import { useDebouncedCallback } from '../hooks/useDebounce';

/**
 * Animation variants - defined outside component to prevent recreation
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120, damping: 20 }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

/**
 * Section Header Component
 */
const SectionHeader = memo(function SectionHeader({ children }) {
  return (
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 border-b border-green-200 flex items-center gap-2">
      <span className="w-2 h-8 bg-green-500 rounded-full" aria-hidden="true" />
      {children}
    </h2>
  );
});

/**
 * Submit Button Component
 */
const SubmitButton = memo(function SubmitButton({ isSubmitting, isValid }) {
  return (
    <motion.button
      whileHover={!isSubmitting ? { scale: 1.01 } : {}}
      whileTap={!isSubmitting ? { scale: 0.99 } : {}}
      type="submit"
      disabled={isSubmitting}
      className={`
        w-full 
        touch-target
        px-6 sm:px-8 
        py-4 sm:py-5
        text-base sm:text-lg
        font-semibold 
        text-white 
        rounded-lg sm:rounded-xl
        transition-all duration-200 
        focus:outline-none 
        focus:ring-4 
        focus:ring-green-500/30
        disabled:opacity-60 
        disabled:cursor-not-allowed 
        flex items-center justify-center gap-3 
        ${isSubmitting 
          ? 'bg-gray-400' 
          : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-500/30'
        }
      `}
      aria-busy={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <div 
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span>Submitting...</span>
        </>
      ) : (
        <>
          <Send size={20} aria-hidden="true" />
          <span>Submit Registration</span>
        </>
      )}
    </motion.button>
  );
});

/**
 * File Upload Component
 */
const FileUpload = memo(function FileUpload({ previewUrl, onFileChange, error }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Upload Area */}
      <div className="flex-1">
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-green-400 hover:bg-green-50/30 transition-all duration-200 group cursor-pointer">
          <input
            type="file"
            name="picture"
            onChange={onFileChange}
            accept="image/jpeg,image/jpg,image/png"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Upload profile picture"
          />
          <div className="group-hover:scale-110 transition-transform duration-200">
            <Upload 
              className="mx-auto h-12 w-12 text-gray-400 group-hover:text-green-500 mb-4" 
              aria-hidden="true"
            />
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            Click to upload your picture
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG up to 2MB
          </p>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-2" role="alert">{error}</p>
        )}
      </div>

      {/* Preview Area */}
      {previewUrl && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:w-48"
        >
          <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-200 shadow-md">
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-green-600 text-center mt-2 flex items-center justify-center gap-1">
            <CheckCircle size={14} aria-hidden="true" />
            Image uploaded
          </p>
        </motion.div>
      )}
    </div>
  );
});

/**
 * Main Registration Form Component
 */
function RegistrationForm() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use custom form validation hook
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateAll,
    setFieldValue,
    setFieldError,
    isValid,
  } = useFormValidation(INITIAL_FORM_STATE);

  // Debounced validation for better performance
  const debouncedValidation = useDebouncedCallback((name, value) => {
    // Additional async validation could go here
  }, 300);

  // Handle input change with debounced validation
  const handleInputChange = useCallback((e) => {
    handleChange(e);
    debouncedValidation(e.target.name, e.target.value);
  }, [handleChange, debouncedValidation]);

  // Handle file change
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      setFieldError('picture', 'Please select a valid image file (JPG, PNG)');
      toast.error('Please select a valid image file (JPG, PNG)');
      return;
    }

    if (file.size > maxSize) {
      setFieldError('picture', 'File size must be less than 2MB');
      toast.error('File size must be less than 2MB');
      return;
    }

    setFieldValue('picture', file);
    setFieldError('picture', '');
    
    // Create preview URL and cleanup old one
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
    toast.success('Image uploaded successfully');
  }, [setFieldValue, setFieldError, previewUrl]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Resolve foreign keys
      const { cityId, courseId } = await ensureLookups({ 
        cityName: formData.city, 
        courseName: formData.course 
      });
      
      if (!cityId || !courseId) {
        toast.error('City or Course not found. Please try again.');
        return;
      }

      // Upsert student by CNIC
      const student = await upsertStudent({
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        email: formData.email,
        phone: formData.phone,
        cnic: formData.cnic,
        fatherCnic: formData.fatherCnic,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        country: formData.country || 'Pakistan',
      });

      // Insert registration row
      await insertRegistration({
        studentId: student.id,
        courseId,
        cityId,
        classPreference: formData.classPreference,
        computerProficiency: formData.computerProficiency,
        hasLaptop: formData.hasLaptop === 'Yes',
        lastQualification: formData.lastQualification,
      });

      toast.success('Registration submitted successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Error submitting registration');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateAll]);

  // Memoize form sections for performance
  const personalInfoFields = useMemo(() => [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'fatherName', label: "Father's Name", type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'cnic', label: 'CNIC', type: 'text', required: true },
    { name: 'fatherCnic', label: "Father's CNIC", type: 'text', optional: true },
    { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
    { name: 'gender', label: 'Gender', options: GENDERS, required: true },
  ], []);

  const courseFields = useMemo(() => [
    { name: 'country', label: 'Country', options: COUNTRIES, required: true },
    { name: 'city', label: 'City', options: CITIES, required: true },
    { name: 'course', label: 'Course', options: COURSES, required: true },
    { name: 'classPreference', label: 'Class Preference', options: CLASS_PREFERENCES, required: true },
  ], []);

  const additionalFields = useMemo(() => [
    { name: 'computerProficiency', label: 'Computer Proficiency', options: COMPUTER_PROFICIENCY },
    { name: 'hasLaptop', label: 'Do you have a laptop?', options: YES_NO_OPTIONS, required: true },
    { name: 'lastQualification', label: 'Last Qualification', options: QUALIFICATIONS, required: true },
  ], []);

  return (
    <main className="responsive-container max-w-6xl mx-auto pb-8 sm:pb-12">
      <motion.div 
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-green-100"
      >
        {/* Header Section */}
        <header className="text-center mb-6 sm:mb-8">
          <motion.h1 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2"
          >
            Registration Form - SMIT
          </motion.h1>
          <p className="text-sm sm:text-base text-gray-600">
            Services - Education - Registration
          </p>
        </header>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8" noValidate>
          
          {/* Personal Information Section */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-labelledby="personal-info-heading"
          >
            <SectionHeader>
              <span id="personal-info-heading">Personal Information</span>
            </SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {personalInfoFields.map((field) => (
                <motion.div key={field.name} variants={itemVariants}>
                  <FormInput
                    {...field}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={errors[field.name]}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Location & Course Selection */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            aria-labelledby="course-info-heading"
          >
            <SectionHeader>
              <span id="course-info-heading">Course & Location Details</span>
            </SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {courseFields.map((field) => (
                <motion.div key={field.name} variants={itemVariants}>
                  <FormInput
                    {...field}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={errors[field.name]}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Additional Information */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            aria-labelledby="additional-info-heading"
          >
            <SectionHeader>
              <span id="additional-info-heading">Additional Information</span>
            </SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {additionalFields.map((field) => (
                <motion.div key={field.name} variants={itemVariants}>
                  <FormInput
                    {...field}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={errors[field.name]}
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Address Field */}
            <motion.div variants={itemVariants} className="mt-4 sm:mt-6">
              <label 
                htmlFor="address"
                className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
              >
                Complete Address <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter your complete address..."
                rows={4}
                required
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? 'address-error' : undefined}
                className={`
                  w-full px-3 sm:px-4 py-3 text-base border-2 rounded-lg 
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-green-500/20 
                  ${errors.address 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-green-500 hover:border-green-400'
                  }
                `}
                style={{ fontSize: '16px' }}
              />
              {errors.address && (
                <p id="address-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.address}
                </p>
              )}
            </motion.div>
          </motion.section>

          {/* File Upload Section */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            aria-labelledby="profile-picture-heading"
          >
            <SectionHeader>
              <span id="profile-picture-heading">Profile Picture</span>
            </SectionHeader>
            <FileUpload 
              previewUrl={previewUrl}
              onFileChange={handleFileChange}
              error={errors.picture}
            />
          </motion.section>

          {/* Submit Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-6 sm:pt-8 border-t border-green-100"
          >
            <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
            
            <p className="text-xs sm:text-sm text-gray-500 mt-4 text-center">
              By submitting this form, you agree to our terms and conditions.
            </p>
          </motion.section>
        </form>
      </motion.div>
    </main>
  );
}

export default memo(RegistrationForm);