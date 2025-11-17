import { useState } from 'react';
import FormInput from './FormInput';
import { COUNTRIES, CLASS_PREFERENCES, GENDERS, CITIES, COURSES } from '../constants/formOptions';

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

  // Your validation logic here
  const validateField = (name, value) => {
    let error = '';
    // Add validation logic from the artifact
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
    // Add file handling logic from the artifact
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add submit logic
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Registration Form - SMIT
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Services - Education - Registration
        </p>

        <div className="flex gap-4 mb-8 border-b">
          <button className="px-6 py-3 text-green-600 border-b-2 border-green-600 font-medium">
            <a href="/">Registration</a>
          </button>
          <button className="px-6 py-3 text-gray-600 hover:text-gray-800">
            <a href="/download-id">Download ID Card</a>
          </button>
          <button className="px-6 py-3 text-gray-600 hover:text-gray-800">
            <a href="/results">Results</a>
          </button>
        </div>

        <div className="space-y-6 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
            />
            <FormInput
              label="Father's Name"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleInputChange}
              error={errors.fatherName}
            />
            <FormInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <FormInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />
            <FormInput
              label="CNIC"
              name="cnic"
              value={formData.cnic}
              onChange={handleInputChange}
              error={errors.cnic}
            />
            <FormInput
              label="Father's CNIC (Optional)"
              name="fatherCnic"
              value={formData.fatherCnic}
              onChange={handleInputChange}
              error={errors.fatherCnic}
              optional
            />
            <FormInput
              label="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              error={errors.dob}
            />
            <FormInput
              label="Select country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              error={errors.country}
              options={COUNTRIES}
            />
            
            <FormInput
              label="Select class preference"
              name="classPreference"
              value={formData.classPreference}
              onChange={handleInputChange}
              error={errors.classPreference}
              options={CLASS_PREFERENCES}
            />

            {/* Add more FormInput components */}
            <FormInput
              label="Select gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              error={errors.gender}
              options={GENDERS}
            />
            
            <FormInput
              label="Select city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              error={errors.city}
              options={CITIES}
            />
            
            <FormInput
              label="Select course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              error={errors.course}
              options={COURSES}
            />
            
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-md transition duration-200"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}