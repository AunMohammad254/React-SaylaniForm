/**
 * Student Query utilities
 * Centralized database queries for student data
 */

import { supabase } from './supabaseClient';

/**
 * Custom error class for query errors
 */
export class QueryError extends Error {
  constructor(message, code, originalError = null) {
    super(message);
    this.name = 'QueryError';
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * Error codes for queries
 */
export const QUERY_ERROR_CODES = {
  STUDENT_NOT_FOUND: 'STUDENT_NOT_FOUND',
  QUERY_FAILED: 'QUERY_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
};

/**
 * Format CNIC from 13-digit to formatted version
 * @param {string} cnic13 - 13-digit CNIC
 * @returns {string} - Formatted CNIC or original if invalid
 */
function formatCnic(cnic13) {
  if (!/^\d{13}$/.test(cnic13)) return cnic13;
  return `${cnic13.slice(0, 5)}-${cnic13.slice(5, 12)}-${cnic13.slice(12)}`;
}

/**
 * Normalize CNIC input (remove dashes/spaces)
 * @param {string} cnic - CNIC to normalize
 * @returns {string} - Normalized CNIC
 */
function normalizeCnic(cnic) {
  return (cnic || '').replace(/[-\s]/g, '');
}

/**
 * Find student by CNIC
 * @param {string} cnicRaw - CNIC (with or without dashes)
 * @returns {Promise<Object|null>} - Student object or null
 * @throws {QueryError} - If query fails
 */
export async function findStudentByCnic(cnicRaw) {
  const cnic = normalizeCnic(cnicRaw);
  
  if (!cnic) {
    throw new QueryError(
      'CNIC is required',
      QUERY_ERROR_CODES.INVALID_INPUT
    );
  }
  
  try {
    const formattedCnic = formatCnic(cnic);
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .or(`cnic.eq.${cnic},cnic.eq.${formattedCnic}`)
      .limit(1);
    
    if (error) {
      throw new QueryError(
        `Failed to find student: ${error.message}`,
        QUERY_ERROR_CODES.QUERY_FAILED,
        error
      );
    }
    
    return data?.[0] ?? null;
  } catch (error) {
    if (error instanceof QueryError) throw error;
    
    throw new QueryError(
      'Network error while finding student',
      QUERY_ERROR_CODES.NETWORK_ERROR,
      error
    );
  }
}

/**
 * Find student by student code
 * @param {string} studentCode - Student code
 * @returns {Promise<Object|null>} - Student object or null
 * @throws {QueryError} - If query fails
 */
export async function findStudentByCode(studentCode) {
  const code = (studentCode || '').trim();
  
  if (!code) {
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_code', code)
      .limit(1);
    
    if (error) {
      throw new QueryError(
        `Failed to find student: ${error.message}`,
        QUERY_ERROR_CODES.QUERY_FAILED,
        error
      );
    }
    
    return data?.[0] ?? null;
  } catch (error) {
    if (error instanceof QueryError) throw error;
    
    throw new QueryError(
      'Network error while finding student',
      QUERY_ERROR_CODES.NETWORK_ERROR,
      error
    );
  }
}

/**
 * Find student by CNIC or student code
 * @param {Object} params - Search parameters
 * @param {string} [params.cnic] - CNIC to search
 * @param {string} [params.studentCode] - Student code to search
 * @returns {Promise<Object|null>} - Student object or null
 */
export async function findStudent({ cnic, studentCode }) {
  if (cnic) {
    return findStudentByCnic(cnic);
  }
  
  if (studentCode) {
    return findStudentByCode(studentCode);
  }
  
  throw new QueryError(
    'Either CNIC or student code is required',
    QUERY_ERROR_CODES.INVALID_INPUT
  );
}

/**
 * Get latest result for a student
 * @param {number} studentId - Student ID
 * @returns {Promise<Object|null>} - Result with batch and course info
 * @throws {QueryError} - If query fails
 */
export async function getLatestResultForStudent(studentId) {
  if (!studentId) {
    throw new QueryError(
      'Student ID is required',
      QUERY_ERROR_CODES.INVALID_INPUT
    );
  }
  
  try {
    const { data, error } = await supabase
      .from('results')
      .select(`
        *,
        batches(number),
        courses(name)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      throw new QueryError(
        `Failed to get results: ${error.message}`,
        QUERY_ERROR_CODES.QUERY_FAILED,
        error
      );
    }
    
    return data?.[0] ?? null;
  } catch (error) {
    if (error instanceof QueryError) throw error;
    
    throw new QueryError(
      'Network error while fetching results',
      QUERY_ERROR_CODES.NETWORK_ERROR,
      error
    );
  }
}

/**
 * Get all registrations for a student
 * @param {number} studentId - Student ID
 * @returns {Promise<Object[]>} - Array of registrations
 * @throws {QueryError} - If query fails
 */
export async function getRegistrationsForStudent(studentId) {
  if (!studentId) {
    throw new QueryError(
      'Student ID is required',
      QUERY_ERROR_CODES.INVALID_INPUT
    );
  }
  
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        courses(name),
        cities(name)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new QueryError(
        `Failed to get registrations: ${error.message}`,
        QUERY_ERROR_CODES.QUERY_FAILED,
        error
      );
    }
    
    return data ?? [];
  } catch (error) {
    if (error instanceof QueryError) throw error;
    
    throw new QueryError(
      'Network error while fetching registrations',
      QUERY_ERROR_CODES.NETWORK_ERROR,
      error
    );
  }
}

/**
 * Get complete student profile with results and registrations
 * @param {string} cnic - Student CNIC
 * @returns {Promise<Object|null>} - Complete student profile
 */
export async function getStudentProfile(cnic) {
  const student = await findStudentByCnic(cnic);
  
  if (!student) {
    return null;
  }
  
  const [latestResult, registrations] = await Promise.all([
    getLatestResultForStudent(student.id),
    getRegistrationsForStudent(student.id),
  ]);
  
  return {
    ...student,
    latestResult,
    registrations,
  };
}

export default {
  findStudentByCnic,
  findStudentByCode,
  findStudent,
  getLatestResultForStudent,
  getRegistrationsForStudent,
  getStudentProfile,
  QueryError,
  QUERY_ERROR_CODES,
};
