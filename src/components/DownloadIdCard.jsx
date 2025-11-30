import { useState, useRef, useCallback, memo, useMemo } from 'react';
import { Download, Printer, Search } from 'lucide-react';
import { normalizeCnic } from '../utils/studentService';
import { findStudentByCnic, getRegistrationsForStudent } from '../utils/studentQueries';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

/**
 * Animation variants
 */
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
};

/**
 * CNIC validation helper
 */
const validateCNIC = (value) => {
  const cleanCNIC = value.replace(/[-\s]/g, '');
  if (!cleanCNIC) return 'CNIC is required';
  if (!/^[0-9]{13}$/.test(cleanCNIC) && !/^[0-9]{5}-[0-9]{7}-[0-9]$/.test(value)) {
    return 'Invalid CNIC format';
  }
  return '';
};

/**
 * Action Button Component
 */
const ActionButton = memo(function ActionButton({ onClick, icon: Icon, children, variant = 'primary' }) {
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    secondary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex items-center gap-2 
        px-4 sm:px-6 py-2 sm:py-3 
        ${variants[variant]}
        text-white font-semibold 
        rounded-md transition-colors
        shadow-md hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2
        touch-target
      `}
    >
      <Icon size={18} aria-hidden="true" />
      <span className="hidden sm:inline">{children}</span>
      <span className="sm:hidden">{children}</span>
    </motion.button>
  );
});

/**
 * Student ID Card Component
 */
const StudentIDCard = memo(function StudentIDCard({ studentData, cardRef }) {
  const campuses = useMemo(() => [
    'SMIT Malir Campus',
    'SMIT Bahadurabad Campus',
    'SMIT Gulshan Campus',
    'SMIT Paposh Campus',
    'SMIT Aliabad (Female) Campus',
    'SMIT Numaish Campus',
  ], []);

  const instructions = useMemo(() => [
    'Please colour print of this Admit/ID card',
    'Attestation of ID/Admit Card is extremely mandatory from SMIT',
    'No student will be allowed to enter in Entry Test without attestation of Admit/ID Card',
    'Bring CNIC and Last qualification Marksheet/Certification. (both original) at the time of Attestation',
  ], []);

  return (
    <div ref={cardRef} className="max-w-3xl mx-auto bg-white p-4 sm:p-8 print:p-0">
      <div className="border-4 border-green-600 rounded-lg overflow-hidden shadow-xl">
        {/* Card Header */}
        <div className="bg-linear-to-r from-green-600 to-green-700 p-4 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <img 
              src="https://saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf709605809177256c.png" 
              alt="Saylani Welfare Trust"
              className="h-12 sm:h-16 bg-white px-3 py-1 rounded"
              loading="lazy"
              width="120"
              height="48"
            />
            <div className="text-center sm:text-right">
              <h2 className="text-xl sm:text-2xl font-bold">{studentData.course}</h2>
              <p className="text-sm sm:text-lg opacity-90">{studentData.studentId}</p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-8 bg-white">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* Student Photo */}
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="w-32 h-40 sm:w-40 sm:h-48 border-4 border-gray-300 rounded-lg overflow-hidden">
                <img 
                  src={studentData.photo} 
                  alt={`${studentData.name}'s photo`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Student Information */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              <InfoField label="Name" value={studentData.name} isLarge />
              <InfoField label="Father name" value={studentData.fatherName} />
              <InfoField label="CNIC" value={studentData.cnic} />
              <InfoField label="Course" value={studentData.course} />
              <InfoField label="Batch" value={`WMA BATCH (${studentData.batch})`} />
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-gray-200">
            {/* Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 mb-4">
              <p className="text-sm font-semibold text-yellow-800">
                Note: This card is for SMIT premises only.
              </p>
              <p className="text-sm text-yellow-700">
                If found please return to SMIT
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 text-base sm:text-lg">Instructions:</h3>
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                {instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>

              {/* Campus List */}
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                  You can visit any of the following campus for Attestation:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-700">
                  {campuses.map((campus, index) => (
                    <div key={campus}>{index + 1}. {campus}</div>
                  ))}
                </div>
              </div>

              {/* Donate Link */}
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Donate Us:</span>{' '}
                  <a 
                    href="https://www.saylaniwelfare.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    https://www.saylaniwelfare.com
                  </a>
                </p>
              </div>

              {/* Signatures */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-6 pt-4 border-t-2 border-gray-300">
                <SignatureField label="Student Signature" />
                <SignatureField label="Issuing Authority" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Info Field Component
 */
const InfoField = memo(function InfoField({ label, value, isLarge = false }) {
  return (
    <div>
      <p className="text-xs sm:text-sm text-gray-600 font-semibold">{label}:</p>
      <p className={`font-${isLarge ? 'bold' : 'medium'} text-gray-800 ${
        isLarge ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
      }`}>
        {value}
      </p>
    </div>
  );
});

/**
 * Signature Field Component
 */
const SignatureField = memo(function SignatureField({ label }) {
  return (
    <div className="text-center">
      <div className="border-t-2 border-gray-400 w-36 sm:w-48 mx-auto mb-2" />
      <p className="text-xs sm:text-sm font-semibold text-gray-700">{label}</p>
    </div>
  );
});

/**
 * Main DownloadIDCard Component
 */
function DownloadIDCard() {
  const [cnic, setCnic] = useState('');
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  const handleCNICChange = useCallback((e) => {
    const value = e.target.value;
    setCnic(value);
    if (value) {
      setError(validateCNIC(value));
    } else {
      setError('');
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationError = validateCNIC(cnic);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    const cleanCNIC = normalizeCnic(cnic);

    try {
      const student = await findStudentByCnic(cleanCNIC);
      if (student) {
        const regs = await getRegistrationsForStudent(student.id);
        const courseName = regs?.[0]?.courses?.name || 'N/A';
        setStudentData({
          name: student.full_name,
          fatherName: student.father_name,
          cnic: student.cnic,
          course: courseName,
          batch: regs?.[0]?.batch || 'N/A',
          studentId: student.student_code || 'N/A',
          photo: student.picture_url || 'https://placehold.co/200x240?text=Photo',
        });
        setError('');
        toast.success('Student record found!');
      } else {
        setError('No record found with this CNIC. Please check and try again.');
        setStudentData(null);
        toast.error('No record found with this CNIC.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error connecting to database.');
      toast.error('Database connection error');
    } finally {
      setLoading(false);
    }
  }, [cnic]);

  const handleDownload = useCallback(() => {
    if (cardRef.current) {
      toast.success('Download started...');
      // Implementation for actual download would go here
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="min-h-screen">
      <div className="responsive-container max-w-6xl mx-auto pb-8 sm:pb-12">
        <motion.div 
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 lg:p-8 border border-green-100"
        >
          {/* Header */}
          <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl text-green-600 font-bold mb-2">
              Download ID Card
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Enter your CNIC to download your student ID card
            </p>
          </header>

          {/* CNIC Search Form */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="cnic-input"
                  className="block text-sm font-medium text-green-600 mb-2"
                >
                  CNIC (Which you provided during form submission)
                </label>
                <input
                  id="cnic-input"
                  type="text"
                  value={cnic}
                  onChange={handleCNICChange}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., 42101-4349016-7"
                  maxLength={15}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'cnic-error' : undefined}
                  className={`
                    w-full px-4 py-3 
                    border-2 text-gray-900
                    rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-green-500/20
                    transition-colors duration-200
                    ${error 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-green-500'
                    }
                  `}
                  style={{ fontSize: '16px' }}
                />
                {error && (
                  <p id="cnic-error" className="text-red-500 text-sm mt-1" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={loading}
                className="
                  w-full flex items-center justify-center gap-2
                  bg-green-600 hover:bg-green-700 
                  text-white font-semibold 
                  py-3 px-6 rounded-lg 
                  transition-colors duration-200 
                  disabled:bg-gray-400 disabled:cursor-not-allowed
                  shadow-lg hover:shadow-green-500/30
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                  touch-target
                "
                aria-busy={loading}
              >
                <Search size={18} aria-hidden="true" />
                {loading ? 'Searching...' : 'Search'}
              </motion.button>
            </div>
          </div>

          {/* ID Card Display */}
          {studentData && (
            <motion.div 
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Action Buttons */}
              <div className="flex justify-center gap-3 sm:gap-4 print:hidden">
                <ActionButton onClick={handleDownload} icon={Download} variant="primary">
                  Download
                </ActionButton>
                <ActionButton onClick={handlePrint} icon={Printer} variant="secondary">
                  Print
                </ActionButton>
              </div>

              {/* Courses Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full border-collapse min-w-[400px]">
                  <thead className="bg-green-50 text-green-800">
                    <tr>
                      <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">
                        Course / Event
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">
                        Batch
                      </th>
                      <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-green-50/30 text-gray-800 transition-colors">
                      <td className="border-b border-gray-200 px-4 py-3">{studentData.course}</td>
                      <td className="border-b border-gray-200 px-4 py-3">{studentData.batch}</td>
                      <td className="border-b border-gray-200 px-4 py-3">
                        <button
                          onClick={handleDownload}
                          className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ID Card */}
              <StudentIDCard studentData={studentData} cardRef={cardRef} />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:p-0, .print\\:p-0 * { visibility: visible; }
          .print\\:p-0 { position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default memo(DownloadIDCard);