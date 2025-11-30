import { useState, useEffect } from 'react';
import FormInput from './FormInput';
import { COUNTRIES, CLASS_PREFERENCES, GENDERS, CITIES, COURSES } from '../constants/formOptions';
import { Upload, FileText, CheckCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    country: '',
    classPreference: '',
    gender: '',
    city: '',
    course: '',
    fullName: '',
    fatherName: '',
    email: '',
    phone: '',
    cnic: '',
    fatherCnic: '',
    dob: '',
    computerProficiency: '',
    hasLaptop: '',
    lastQualification: '',
    address: '',
    picture: null
  });

  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('registration');

  // Navigation tabs data
  const tabs = [
    { id: 'registration', label: 'Registration', href: '/', active: true },
    { id: 'download', label: 'Download ID Card', href: '/download-id', active: false },
    { id: 'results', label: 'Results', href: '/results', active: false }
  ];

  // Validation logic
  const validateField = (name, value) => {
    let error = '';
    // Add validation logic here
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, picture: 'Please select a valid image file (JPG, PNG)' }));
        toast.error('Please select a valid image file (JPG, PNG)');
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, picture: 'File size must be less than 2MB' }));
        toast.error('File size must be less than 2MB');
        return;
      }

      setFormData(prev => ({ ...prev, picture: file }));
      setErrors(prev => ({ ...prev, picture: '' }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      toast.success('Image uploaded successfully');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Form submitted successfully!');
    } catch (error) {
      toast.error('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <main className="responsive-container max-w-6xl mx-auto pb-8 sm:pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-green-100"
      >
        
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2"
          >
            Registration Form - SMIT
          </motion.h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Services - Education - Registration
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          
          {/* Personal Information Section */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 border-b border-green-200 flex items-center gap-2">
              <span className="w-2 h-8 bg-green-500 rounded-full"></span>
              Personal Information
            </h2>
            <div className="responsive-grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={errors.fullName}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Father's Name"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  error={errors.fatherName}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="CNIC"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  error={errors.cnic}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Father's CNIC"
                  name="fatherCnic"
                  value={formData.fatherCnic}
                  onChange={handleInputChange}
                  error={errors.fatherCnic}
                  optional
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  error={errors.dob}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  error={errors.gender}
                  options={GENDERS}
                  required
                />
              </motion.div>
            </div>
          </motion.section>

          {/* Location & Course Selection */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 border-b border-green-200 flex items-center gap-2">
              <span className="w-2 h-8 bg-green-500 rounded-full"></span>
              Course & Location Details
            </h2>
            <div className="responsive-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  error={errors.country}
                  options={COUNTRIES}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={errors.city}
                  options={CITIES}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  error={errors.course}
                  options={COURSES}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Class Preference"
                  name="classPreference"
                  value={formData.classPreference}
                  onChange={handleInputChange}
                  error={errors.classPreference}
                  options={CLASS_PREFERENCES}
                  required
                />
              </motion.div>
            </div>
          </motion.section>

          {/* Additional Information */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 border-b border-green-200 flex items-center gap-2">
              <span className="w-2 h-8 bg-green-500 rounded-full"></span>
              Additional Information
            </h2>
            <div className="responsive-grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Computer Proficiency"
                  name="computerProficiency"
                  value={formData.computerProficiency}
                  onChange={handleInputChange}
                  error={errors.computerProficiency}
                  options={['Beginner', 'Intermediate', 'Advanced']}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Do you have a laptop?"
                  name="hasLaptop"
                  value={formData.hasLaptop}
                  onChange={handleInputChange}
                  error={errors.hasLaptop}
                  options={['Yes', 'No']}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Last Qualification"
                  name="lastQualification"
                  value={formData.lastQualification}
                  onChange={handleInputChange}
                  error={errors.lastQualification}
                  options={['Matric', 'Intermediate', 'Bachelor', 'Master', 'Other']}
                  required
                />
              </motion.div>
            </div>
            
            {/* Address Field */}
            <motion.div variants={itemVariants} className="mt-4 sm:mt-6">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Complete Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your complete address..."
                rows={4}
                className="w-full px-3 sm:px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                style={{ fontSize: '16px' }}
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address}</p>
              )}
            </motion.div>
          </motion.section>

          {/* File Upload Section */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 pb-2 border-b border-green-200 flex items-center gap-2">
              <span className="w-2 h-8 bg-green-500 rounded-full"></span>
              Profile Picture
            </h2>
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Upload Area */}
              <motion.div variants={itemVariants} className="flex-1">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-green-400 hover:bg-green-50/30 transition-all duration-200 group">
                  <input
                    type="file"
                    name="picture"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="group-hover:scale-110 transition-transform duration-200">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-green-500 mb-4" />
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">
                    Click to upload your picture
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 2MB
                  </p>
                </div>
                {errors.picture && (
                  <p className="text-red-600 text-sm mt-2">{errors.picture}</p>
                )}
              </motion.div>

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
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>

          {/* Submit Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-6 sm:pt-8 border-t border-green-100"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                disabled:transform-none
                flex items-center justify-center gap-3 
                ${isSubmitting 
                  ? 'bg-gray-400' 
                  : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-500/30'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Registration
                </>
              )}
            </motion.button>
            
            <p className="text-xs sm:text-sm text-gray-500 mt-4 text-center">
              By submitting this form, you agree to our terms and conditions.
            </p>
          </motion.section>
        </form>
      </motion.div>
    </main>
  );
}