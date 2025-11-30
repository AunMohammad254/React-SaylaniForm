import { useState, useMemo, useRef } from 'react';
import { validateCNIC } from '../utils/validation';
import { Search, Download, Printer } from 'lucide-react';
import { search as searchStudent } from '../utils/studentService';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function Results() {
  const [cnic, setCnic] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const cardRef = useRef(null);

  const normalizedCNIC = useMemo(() => cnic.replace(/[-\s]/g, ''), [cnic]);

  const onSearch = () => {
    if (!normalizedCNIC && !studentCode) {
      setError('Provide CNIC or Student Code to search');
      toast.error('Provide CNIC or Student Code to search');
      return;
    }

    if (normalizedCNIC && !validateCNIC(cnic)) {
      setError('Invalid CNIC format. Use 13 digits or 5-7-1 pattern.');
      toast.error('Invalid CNIC format');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const found = searchStudent({ cnic: normalizedCNIC, studentCode });
      if (!found) {
        setError('No record found. Please check your details and try again.');
        setResult(null);
        toast.error('No record found');
      } else {
        setResult(found);
        toast.success('Result found!');
      }
      setLoading(false);
    }, 600);
  };

  const handleDownload = () => {
    if (cardRef.current) {
      toast.success('Download started...');
      // alert('Download will export the ID card as image/PDF.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 sm:p-8 border border-green-100"
        >
          <h1 className="text-2xl sm:text-3xl text-green-600 font-bold text-center mb-2">Results & ID Card</h1>
          <p className="text-center text-gray-700 mb-8">Find your ID card by CNIC or Student Code</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto mb-8">
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">CNIC</label>
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="e.g. 42101-4349016-7 or 4210143490167"
                className={`w-full px-4 py-3 border text-black rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  error && !studentCode ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={15}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">Student Code</label>
              <input
                type="text"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="e.g. WMA-345770"
                className={`w-full px-4 py-3 border text-black rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  error && !normalizedCNIC ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="max-w-3xl mx-auto mb-4"
            >
              <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm rounded">
                {error}
              </div>
            </motion.div>
          )}

          <div className="max-w-3xl mx-auto mb-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSearch}
              disabled={loading}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200 disabled:bg-gray-400 shadow-lg hover:shadow-green-500/30 mx-auto"
            >
              <Search size={18} /> {loading ? 'Searching...' : 'Search'}
            </motion.button>
          </div>

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full border-collapse">
                  <thead className="bg-green-50 text-green-800">
                    <tr>
                      <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">Course / Event</th>
                      <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">Batch</th>
                      <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-green-50/30 text-gray-800 transition-colors">
                      <td className="border-b border-gray-200 px-4 py-3">{result.course}</td>
                      <td className="border-b border-gray-200 px-4 py-3">{result.batch}</td>
                      <td className="border-b border-gray-200 px-4 py-3">
                        <div className="flex gap-3">
                          <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition text-sm"
                          >
                            <Download size={18} /> Download
                          </button>
                          <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition text-sm"
                          >
                            <Printer size={18} /> Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div ref={cardRef} className="max-w-3xl mx-auto bg-white p-6 sm:p-8 print:p-0">
                <div className="border-4 border-green-600 rounded-lg overflow-hidden shadow-xl">
                  <div className="bg-linear-to-r from-green-600 to-green-700 p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between gap-4">
                      <img
                        src="https://saylaniwelfare.com/static/media/logo_saylaniwelfare.22bf709605809177256c.png"
                        alt="Saylani"
                        className="h-12 sm:h-16 bg-white px-3 py-1 rounded"
                      />
                      <div className="text-right">
                        <h2 className="text-xl sm:text-2xl font-bold">{result.course}</h2>
                        <p className="text-sm sm:text-lg">{result.studentId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 bg-white">
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                      <div className="sm:shrink-0">
                        <div className="w-28 h-36 sm:w-40 sm:h-48 border-4 border-gray-300 rounded-lg overflow-hidden">
                          <img src={result.photo} alt="Student" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Name:</p>
                          <p className="text-lg sm:text-xl font-bold text-gray-800">{result.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Father name:</p>
                          <p className="text-base sm:text-lg font-medium text-gray-800">{result.fatherName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">CNIC:</p>
                          <p className="text-base sm:text-lg font-medium text-gray-800">{result.cnic}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Course:</p>
                          <p className="text-base sm:text-lg font-medium text-gray-800">{result.course}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-semibold">Batch:</p>
                          <p className="text-base sm:text-lg font-medium text-gray-800">WMA BATCH ({result.batch})</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t-2 border-gray-200">
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                        <p className="text-sm font-semibold text-yellow-800">Note: This card is for SMIT premises only.</p>
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
                            <span className="font-semibold">Donate Us:</span>
                            <a href="https://www.saylaniwelfare.com" className="text-green-600 hover:underline"> https://www.saylaniwelfare.com</a>
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-gray-300">
                          <div className="text-center">
                            <div className="border-t-2 border-gray-400 w-40 sm:w-48 mx-auto mb-2"></div>
                            <p className="text-sm font-semibold text-gray-700">Student Signature</p>
                          </div>
                          <div className="text-center">
                            <div className="border-t-2 border-gray-400 w-40 sm:w-48 mx-auto mb-2"></div>
                            <p className="text-sm font-semibold text-gray-700">Issuing Authority</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <style>{`
                @media print {
                  body * { visibility: hidden; }
                  .print\\:p-0, .print\\:p-0 * { visibility: visible; }
                  .print\\:p-0 { position: absolute; left: 0; top: 0; width: 100%; }
                  .print\\:hidden { display: none !important; }
                }
              `}</style>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Results;