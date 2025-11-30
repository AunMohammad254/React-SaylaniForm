/**
 * Registration API utilities
 * Handles student registration with Supabase
 */

import { supabase } from './supabaseClient';

/**
 * Custom error class for API errors
 */
export class RegistrationError extends Error {
  constructor(message, code, originalError = null) {
    super(message);
    this.name = 'RegistrationError';
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * Error codes for registration API
 */
export const ERROR_CODES = {
  CITY_NOT_FOUND: 'CITY_NOT_FOUND',
  COURSE_NOT_FOUND: 'COURSE_NOT_FOUND',
  STUDENT_UPSERT_FAILED: 'STUDENT_UPSERT_FAILED',
  REGISTRATION_FAILED: 'REGISTRATION_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
};

/**
 * Lookup cache for cities and courses
 * Reduces redundant database calls
 */
const lookupCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached lookup or fetch from database
 * @param {string} table - Table name ('cities' or 'courses')
 * @param {string} name - Name to look up
 * @returns {Promise<number|null>} - ID or null if not found
 */
async function getCachedLookup(table, name) {
  const cacheKey = `${table}:${name}`;
  const cached = lookupCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.id;
  }
  
  const { data, error } = await supabase
    .from(table)
    .select('id')
    .eq('name', name)
    .maybeSingle();
  
  if (error) {
    console.error(`Lookup error for ${table}:${name}`, error);
    return null;
  }
  
  if (data) {
    lookupCache.set(cacheKey, { id: data.id, timestamp: Date.now() });
  }
  
  return data?.id ?? null;
}

/**
 * Clear the lookup cache
 * Call this if you need to refresh lookup data
 */
export function clearLookupCache() {
  lookupCache.clear();
}

/**
 * Ensure city and course exist in database
 * @param {Object} params - Lookup parameters
 * @param {string} params.cityName - City name
 * @param {string} params.courseName - Course name
 * @returns {Promise<{cityId: number|null, courseId: number|null}>}
 * @throws {RegistrationError} - If lookup fails
 */
export async function ensureLookups({ cityName, courseName }) {
  try {
    const [cityId, courseId] = await Promise.all([
      getCachedLookup('cities', cityName),
      getCachedLookup('courses', courseName),
    ]);
    
    return { cityId, courseId };
  } catch (error) {
    throw new RegistrationError(
      'Failed to lookup city or course',
      ERROR_CODES.NETWORK_ERROR,
      error
    );
  }
}

/**
 * Build student payload for database
 * @param {Object} student - Student data from form
 * @returns {Object} - Database payload
 */
function buildStudentPayload(student) {
  return {
    full_name: student.fullName?.trim() || '',
    father_name: student.fatherName?.trim() || '',
    email: student.email?.toLowerCase().trim() || '',
    phone: student.phone?.trim() || '',
    cnic: student.cnic?.replace(/[-\s]/g, '') || '',
    father_cnic: student.fatherCnic?.replace(/[-\s]/g, '') || null,
    dob: student.dob || null,
    gender: student.gender || null,
    address: student.address?.trim() || null,
    country: student.country || 'Pakistan',
    picture_url: student.picture_url || null,
    student_code: student.student_code || null,
  };
}

/**
 * Upsert student record (create or update)
 * @param {Object} student - Student data
 * @returns {Promise<{id: number, cnic: string}>} - Created/updated student
 * @throws {RegistrationError} - If upsert fails
 */
export async function upsertStudent(student) {
  const payload = buildStudentPayload(student);
  
  try {
    const { data, error } = await supabase
      .from('students')
      .upsert(payload, { onConflict: 'cnic' })
      .select('id, cnic')
      .maybeSingle();
    
    if (error) {
      throw new RegistrationError(
        `Failed to save student: ${error.message}`,
        ERROR_CODES.STUDENT_UPSERT_FAILED,
        error
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof RegistrationError) throw error;
    
    throw new RegistrationError(
      'Network error while saving student',
      ERROR_CODES.NETWORK_ERROR,
      error
    );
  }
}

/**
 * Build registration payload for database
 * @param {Object} params - Registration parameters
 * @returns {Object} - Database payload
 */
function buildRegistrationPayload({
  studentId,
  courseId,
  cityId,
  classPreference,
  computerProficiency,
  hasLaptop,
  lastQualification,
}) {
  return {
    student_id: studentId,
    course_id: courseId,
    city_id: cityId,
    class_preference: classPreference || null,
    computer_proficiency: computerProficiency || null,
    has_laptop: Boolean(hasLaptop),
    last_qualification: lastQualification || null,
    status: 'pending',
  };
}

/**
 * Insert new registration record
 * @param {Object} params - Registration data
 * @returns {Promise<Object>} - Created registration
 * @throws {RegistrationError} - If insertion fails
 */
export async function insertRegistration({
  studentId,
  courseId,
  cityId,
  classPreference,
  computerProficiency,
  hasLaptop,
  lastQualification,
}) {
  const payload = buildRegistrationPayload({
    studentId,
    courseId,
    cityId,
    classPreference,
    computerProficiency,
    hasLaptop,
    lastQualification,
  });
  
  try {
    const { data, error } = await supabase
      .from('registrations')
      .insert(payload)
      .select('*')
      .single();
    
    if (error) {
      throw new RegistrationError(
        `Failed to create registration: ${error.message}`,
        ERROR_CODES.REGISTRATION_FAILED,
        error
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof RegistrationError) throw error;
    
    throw new RegistrationError(
      'Network error while creating registration',
      ERROR_CODES.NETWORK_ERROR,
      error
    );
  }
}

/**
 * Complete registration process
 * Combines lookup, student upsert, and registration insert
 * @param {Object} formData - Complete form data
 * @returns {Promise<{student: Object, registration: Object}>}
 * @throws {RegistrationError} - If any step fails
 */
export async function submitRegistration(formData) {
  // Step 1: Lookup city and course
  const { cityId, courseId } = await ensureLookups({
    cityName: formData.city,
    courseName: formData.course,
  });
  
  if (!cityId) {
    throw new RegistrationError(
      `City "${formData.city}" not found`,
      ERROR_CODES.CITY_NOT_FOUND
    );
  }
  
  if (!courseId) {
    throw new RegistrationError(
      `Course "${formData.course}" not found`,
      ERROR_CODES.COURSE_NOT_FOUND
    );
  }
  
  // Step 2: Upsert student
  const student = await upsertStudent(formData);
  
  // Step 3: Create registration
  const registration = await insertRegistration({
    studentId: student.id,
    courseId,
    cityId,
    classPreference: formData.classPreference,
    computerProficiency: formData.computerProficiency,
    hasLaptop: formData.hasLaptop,
    lastQualification: formData.lastQualification,
  });
  
  return { student, registration };
}

export default {
  ensureLookups,
  upsertStudent,
  insertRegistration,
  submitRegistration,
  clearLookupCache,
  RegistrationError,
  ERROR_CODES,
};
