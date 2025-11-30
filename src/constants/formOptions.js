/**
 * Form options constants
 * Using Object.freeze for immutability and better performance
 */

export const COUNTRIES = Object.freeze([
  'Pakistan',
  'Other',
]);

export const CLASS_PREFERENCES = Object.freeze([
  'Morning',
  'Evening',
]);

export const GENDERS = Object.freeze([
  'Male',
  'Female',
]);

export const CITIES = Object.freeze([
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Hyderabad',
  'Peshawar',
  'Quetta',
]);

export const COURSES = Object.freeze([
  'Web Development',
  'Mobile App Development',
  'Graphic Design',
  'Digital Marketing',
  'Python Programming',
]);

export const COMPUTER_PROFICIENCY = Object.freeze([
  'Beginner',
  'Intermediate',
  'Advanced',
]);

export const QUALIFICATIONS = Object.freeze([
  'Matric',
  'Intermediate',
  'Bachelor',
  'Master',
  'Other',
]);

export const YES_NO_OPTIONS = Object.freeze([
  'Yes',
  'No',
]);

/**
 * Form field configuration
 * Centralized field definitions for consistency
 */
export const FORM_FIELDS = Object.freeze({
  PERSONAL: Object.freeze([
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'fatherName', label: "Father's Name", type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'cnic', label: 'CNIC', type: 'text', required: true },
    { name: 'fatherCnic', label: "Father's CNIC", type: 'text', optional: true },
    { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
    { name: 'gender', label: 'Gender', type: 'select', options: GENDERS, required: true },
  ]),
  COURSE: Object.freeze([
    { name: 'country', label: 'Country', type: 'select', options: COUNTRIES, required: true },
    { name: 'city', label: 'City', type: 'select', options: CITIES, required: true },
    { name: 'course', label: 'Course', type: 'select', options: COURSES, required: true },
    { name: 'classPreference', label: 'Class Preference', type: 'select', options: CLASS_PREFERENCES, required: true },
  ]),
  ADDITIONAL: Object.freeze([
    { name: 'computerProficiency', label: 'Computer Proficiency', type: 'select', options: COMPUTER_PROFICIENCY },
    { name: 'hasLaptop', label: 'Do you have a laptop?', type: 'select', options: YES_NO_OPTIONS, required: true },
    { name: 'lastQualification', label: 'Last Qualification', type: 'select', options: QUALIFICATIONS, required: true },
  ]),
});

/**
 * Initial form state
 */
export const INITIAL_FORM_STATE = Object.freeze({
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
  picture: null,
});

export default {
  COUNTRIES,
  CLASS_PREFERENCES,
  GENDERS,
  CITIES,
  COURSES,
  COMPUTER_PROFICIENCY,
  QUALIFICATIONS,
  YES_NO_OPTIONS,
  FORM_FIELDS,
  INITIAL_FORM_STATE,
};