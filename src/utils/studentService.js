// Temporary client-side mock data service for student lookup

const records = [
  {
    name: 'AUN ABBAS',
    fatherName: 'ABBAS HAIDER',
    cnic: '4210143490167',
    course: 'Web and Mobile App Development',
    batch: '15',
    studentId: 'WMA-345770',
    photo: 'https://via.placeholder.com/150x180/0ea5e9/ffffff?text=Student+Photo',
  },
  {
    name: 'MUHAMMAD ALI',
    fatherName: 'AHMED ALI',
    cnic: '4210112345678',
    course: 'Generative AI & Chatbot',
    batch: '5',
    studentId: 'GEN-234567',
    photo: 'https://via.placeholder.com/150x180/0ea5e9/ffffff?text=Student+Photo',
  },
];

export function normalizeCnic(value) {
  return (value || '').replace(/[-\s]/g, '');
}

export function findByCnic(cnic) {
  const clean = normalizeCnic(cnic);
  return records.find((r) => r.cnic === clean) || null;
}

export function findByStudentCode(code) {
  if (!code) return null;
  const lower = String(code).toLowerCase();
  return (
    records.find((r) => r.studentId.toLowerCase() === lower) || null
  );
}

export function search({ cnic, studentCode }) {
  const byCnic = cnic ? findByCnic(cnic) : null;
  if (byCnic) return byCnic;
  return studentCode ? findByStudentCode(studentCode) : null;
}

export function all() {
  return [...records];
}
