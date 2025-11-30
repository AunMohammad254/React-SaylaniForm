/**
 * Student Service
 * Client-side service for student lookup with mock data fallback
 * 
 * This service provides a unified interface for student lookups,
 * using Supabase queries with fallback to mock data for development.
 */

import {
  findStudentByCnic as queryByCnic,
  findStudentByCode as queryByCode,
  getLatestResultForStudent,
  getRegistrationsForStudent,
} from './studentQueries';

/**
 * Mock student records for development/testing
 * Remove or disable in production
 */
const MOCK_RECORDS = [
  {
    id: 1,
    full_name: 'AUN ABBAS',
    father_name: 'ABBAS HAIDER',
    cnic: '4210143490167',
    email: 'aun.abbas@example.com',
    phone: '03001234567',
    student_code: 'WMA-345770',
    picture_url: null,
    course: 'Web and Mobile App Development',
    batch: '15',
  },
  {
    id: 2,
    full_name: 'MUHAMMAD ALI',
    father_name: 'AHMED ALI',
    cnic: '4210112345678',
    email: 'muhammad.ali@example.com',
    phone: '03009876543',
    student_code: 'GEN-234567',
    picture_url: null,
    course: 'Generative AI & Chatbot',
    batch: '5',
  },
];

/**
 * Check if we're in development mode
 */
const isDevelopment = import.meta.env?.DEV ?? false;

/**
 * Use mock data instead of real API calls
 * Set to false in production
 */
const USE_MOCK_DATA = isDevelopment && true;

/**
 * Normalize CNIC (remove dashes and spaces)
 * @param {string} value - CNIC to normalize
 * @returns {string} - Normalized CNIC
 */
export function normalizeCnic(value) {
  return (value || '').replace(/[-\s]/g, '');
}

/**
 * Format CNIC to XXXXX-XXXXXXX-X
 * @param {string} cnic - 13-digit CNIC
 * @returns {string} - Formatted CNIC
 */
export function formatCnic(cnic) {
  const normalized = normalizeCnic(cnic);
  if (normalized.length !== 13) return cnic;
  return `${normalized.slice(0, 5)}-${normalized.slice(5, 12)}-${normalized.slice(12)}`;
}

/**
 * Find student by CNIC (mock data)
 * @param {string} cnic - CNIC to search
 * @returns {Object|null} - Student record or null
 */
function findByCnicMock(cnic) {
  const clean = normalizeCnic(cnic);
  return MOCK_RECORDS.find((r) => r.cnic === clean) ?? null;
}

/**
 * Find student by student code (mock data)
 * @param {string} code - Student code to search
 * @returns {Object|null} - Student record or null
 */
function findByStudentCodeMock(code) {
  if (!code) return null;
  const lower = String(code).toLowerCase();
  return MOCK_RECORDS.find((r) => r.student_code?.toLowerCase() === lower) ?? null;
}

/**
 * Find student by CNIC
 * Uses Supabase query with mock fallback
 * @param {string} cnic - CNIC to search
 * @returns {Promise<Object|null>} - Student record or null
 */
export async function findByCnic(cnic) {
  if (!cnic) return null;
  
  if (USE_MOCK_DATA) {
    return findByCnicMock(cnic);
  }
  
  try {
    return await queryByCnic(cnic);
  } catch (error) {
    console.error('Error finding student by CNIC:', error);
    // Fallback to mock in development
    if (isDevelopment) {
      console.warn('Falling back to mock data');
      return findByCnicMock(cnic);
    }
    throw error;
  }
}

/**
 * Find student by student code
 * Uses Supabase query with mock fallback
 * @param {string} code - Student code to search
 * @returns {Promise<Object|null>} - Student record or null
 */
export async function findByStudentCode(code) {
  if (!code) return null;
  
  if (USE_MOCK_DATA) {
    return findByStudentCodeMock(code);
  }
  
  try {
    return await queryByCode(code);
  } catch (error) {
    console.error('Error finding student by code:', error);
    if (isDevelopment) {
      console.warn('Falling back to mock data');
      return findByStudentCodeMock(code);
    }
    throw error;
  }
}

/**
 * Search for student by CNIC or student code
 * @param {Object} params - Search parameters
 * @param {string} [params.cnic] - CNIC to search
 * @param {string} [params.studentCode] - Student code to search
 * @returns {Promise<Object|null>} - Student record or null
 */
export async function search({ cnic, studentCode }) {
  // Try CNIC first
  if (cnic) {
    const byCnic = await findByCnic(cnic);
    if (byCnic) return byCnic;
  }
  
  // Then try student code
  if (studentCode) {
    return await findByStudentCode(studentCode);
  }
  
  return null;
}

/**
 * Get all mock records (for testing)
 * @returns {Object[]} - All mock student records
 */
export function all() {
  return [...MOCK_RECORDS];
}

/**
 * Get student with their latest result
 * @param {number} studentId - Student ID
 * @returns {Promise<Object|null>} - Student with result
 */
export async function getStudentWithResult(studentId) {
  if (USE_MOCK_DATA) {
    const student = MOCK_RECORDS.find((r) => r.id === studentId);
    if (!student) return null;
    
    return {
      ...student,
      result: {
        status: 'pass',
        percentage: 85,
        batch: student.batch,
        course: student.course,
      },
    };
  }
  
  try {
    const result = await getLatestResultForStudent(studentId);
    return result;
  } catch (error) {
    console.error('Error getting student result:', error);
    return null;
  }
}

/**
 * Get student registrations
 * @param {number} studentId - Student ID
 * @returns {Promise<Object[]>} - Array of registrations
 */
export async function getStudentRegistrations(studentId) {
  if (USE_MOCK_DATA) {
    const student = MOCK_RECORDS.find((r) => r.id === studentId);
    if (!student) return [];
    
    return [
      {
        id: 1,
        course: { name: student.course },
        city: { name: 'Karachi' },
        status: 'approved',
        created_at: new Date().toISOString(),
      },
    ];
  }
  
  try {
    return await getRegistrationsForStudent(studentId);
  } catch (error) {
    console.error('Error getting registrations:', error);
    return [];
  }
}

export default {
  normalizeCnic,
  formatCnic,
  findByCnic,
  findByStudentCode,
  search,
  all,
  getStudentWithResult,
  getStudentRegistrations,
};
