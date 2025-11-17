import { useState, useRef } from 'react';
import { Facebook, Instagram, Youtube, User, Download, Printer } from 'lucide-react';

export default function DownloadIDCard() {
  const [cnic, setCnic] = useState('');
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  // Mock database of students
  const studentsDatabase = {
    '4210143490167': {
      name: 'AUN ABBAS',
      fatherName: 'ABBAS HAIDER',
      cnic: '4210143490167',
      course: 'Web and Mobile App Development',
      batch: '15',
      studentId: 'WMA-345770',
      photo: 'https://via.placeholder.com/150x180/0ea5e9/ffffff?text=Student+Photo'
    },
    '4210112345678': {
      name: 'MUHAMMAD ALI',
      fatherName: 'AHMED ALI',
      cnic: '4210112345678',
      course: 'Generative AI & Chatbot',
      batch: '5',
      studentId: 'GEN-234567',
      photo: 'https://via.placeholder.com/150x180/0ea5e9/ffffff?text=Student+Photo'
    }
  };

  const validateCNIC = (value) => {
    const cleanCNIC = value.replace(/[-\s]/g, '');
    if (!cleanCNIC) {
      return 'CNIC is required';
    }
    if (!/^[0-9]{13}$/.test(cleanCNIC) && !/^[0-9]{5}-[0-9]{7}-[0-9]$/.test(value)) {
      return 'Invalid CNIC format';
    }
    return '';
  };

  const handleCNICChange = (e) => {
    const value = e.target.value;
    setCnic(value);
    const validationError = validateCNIC(value);
    setError(validationError);
  };

  const handleSubmit = () => {
    const validationError = validateCNIC(cnic);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const cleanCNIC = cnic.replace(/[-\s]/g, '');

    // Simulate API call
    setTimeout(() => {
      const student = studentsDatabase[cleanCNIC];
      if (student) {
        setStudentData(student);
        setError('');
      } else {
        setError('No record found with this CNIC. Please check and try again.');
        setStudentData(null);
      }
      setLoading(false);
    }, 1000);
  };

  const handleDownload = () => {
    if (cardRef.current) {
      // In a real app, you'd use html2canvas or similar library
      alert('Download functionality would generate a PDF/Image of the ID card here.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf709605809177256c.png" 
                alt="Saylani" 
                className="h-16" 
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition">
              <User size={20} />
              Student portal
            </button>
          </div>
        </div>
      </div> */}

      {/* Social Links */}
      {/* <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-3">
          <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition">
            <Facebook size={20} />
          </a>
          <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition">
            <Instagram size={20} />
          </a>
          <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition">
            <Youtube size={20} />
          </a>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Registration Form - SMIT</h1>
          <p className="text-center text-gray-600 mb-8">Services - Education - Registration</p>

          <div className="flex gap-4 mb-8 border-b">
            <button className="px-6 py-3 text-gray-600 hover:text-gray-800">
              <a href="/">Registration</a>
            </button>
            <button className="px-6 py-3 text-green-600 border-b-2 border-green-600 font-medium">
              <a href="/download-id">Download ID Card</a>
            </button>
            <button className="px-6 py-3 text-gray-600 hover:text-gray-800">
              <a href="/results">Results</a>
            </button>
          </div>

          {/* CNIC Search Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-600 mb-2">
                  CNIC (Which you provided during form submission)
                </label>
                <input
                  type="text"
                  value={cnic}
                  onChange={handleCNICChange}
                  placeholder="CNIC (Which you provided during form submission)"
                  className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={15}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200 disabled:bg-gray-400"
              >
                {loading ? 'SEARCHING...' : 'SUBMIT'}
              </button>
            </div>
          </div>

          {/* ID Card Display */}
          {studentData && (
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex justify-center gap-4 print:hidden">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
                >
                  <Download size={20} />
                  DOWNLOAD
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
                >
                  <Printer size={20} />
                  PRINT
                </button>
              </div>

              {/* Student Cards Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Course / Event</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Batch</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">{studentData.course}</td>
                      <td className="border border-gray-300 px-4 py-3">{studentData.batch}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <button
                          onClick={handleDownload}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
                        >
                          DOWNLOAD
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ID Card Template */}
              <div ref={cardRef} className="max-w-3xl mx-auto bg-white p-8 print:p-0">
                <div className="border-4 border-green-600 rounded-lg overflow-hidden shadow-xl">
                  {/* Card Header */}
                  <div className="bg-linear-to-r from-green-600 to-blue-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <img 
                        src="https://saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf709605809177256c.png" 
                        alt="Saylani" 
                        className="h-16 bg-white px-3 py-1 rounded"
                      />
                      <div className="text-right">
                        <h2 className="text-2xl font-bold">{studentData.course}</h2>
                        <p className="text-lg">{studentData.studentId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 bg-white">
                    <div className="flex gap-8">
                      {/* Student Photo */}
                      <div className="shrink-0">
                        <div className="w-40 h-48 border-4 border-gray-300 rounded-lg overflow-hidden">
                          <img 
                            src={studentData.photo} 
                            alt="Student" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Student Information */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Name:</p>
                          <p className="text-xl font-bold text-gray-800">{studentData.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Father name:</p>
                          <p className="text-lg font-medium text-gray-800">{studentData.fatherName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">CNIC:</p>
                          <p className="text-lg font-medium text-gray-800">{studentData.cnic}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Course:</p>
                          <p className="text-lg font-medium text-gray-800">{studentData.course}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Batch:</p>
                          <p className="text-lg font-medium text-gray-800">WMA BATCH ({studentData.batch})</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-8 pt-6 border-t-2 border-gray-200">
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                        <p className="text-sm font-semibold text-yellow-800">
                          Note: This card is for SMIT premises only.
                        </p>
                        <p className="text-sm text-yellow-700">If found please return to SMIT</p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-bold text-gray-800 text-lg">Instructions:</h3>
                        <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                          <li>Please colour print of this Admit/ID card</li>
                          <li>Attestation of ID/Admit Card is extremely mandatory from SMIT</li>
                          <li>No student will be allowed to enter in Entry Test without attestation of Admit/ID Card</li>
                          <li>Bring CNIC and Last qualification Marksheet/Certification. (both original) at the time of Attestation</li>
                        </ul>

                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800 mb-2">You can visit any of the following campus for Attestation:</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                            <div>1. SMIT Malir Campus</div>
                            <div>2. SMIT Bahadurabad Campus</div>
                            <div>3. SMIT Gulshan Campus</div>
                            <div>4. SMIT Paposh Campus</div>
                            <div>5. SMIT Aliabad (Female) Campus</div>
                            <div>6. SMIT Numaish Campus</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Donate Us:</span>{' '}
                            <a href="https://www.saylaniwelfare.com" className="text-blue-600 hover:underline">
                              https://www.saylaniwelfare.com
                            </a>
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-gray-300">
                          <div className="text-center">
                            <div className="border-t-2 border-gray-400 w-48 mx-auto mb-2"></div>
                            <p className="text-sm font-semibold text-gray-700">Student Signature</p>
                          </div>
                          <div className="text-center">
                            <div className="border-t-2 border-gray-400 w-48 mx-auto mb-2"></div>
                            <p className="text-sm font-semibold text-gray-700">Issuing Authority</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:p-0,
          .print\\:p-0 * {
            visibility: visible;
          }
          .print\\:p-0 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}