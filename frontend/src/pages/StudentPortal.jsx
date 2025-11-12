import { useState, useEffect } from 'react';
import { Bell, BookOpen, Calendar, CheckCircle, Clock, User, CreditCard, FileText, Award } from 'lucide-react';

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [studentData, setStudentData] = useState({
    attendance: { present: 70, total: 85 },
    assignments: { completed: 0, total: 0 },
    course: {
      name: 'Web and Mobile App Development',
      code: 'WMA',
      status: 'ENROLLED',
      schedule: [
        'Mon 02:00 PM - 04:00 PM',
        'Wed 02:00 PM - 04:00 PM',
        'Fri 02:30 PM - 04:30 PM'
      ],
      progress: 0,
      batch: 15,
      rollNumber: 345770
    },
    fees: {
      november: {
        month: 'Nov 2025',
        status: 'PAID',
        dueDate: '08-Nov-2025',
        amount: 'Rs: 1000 /-',
        voucherId: '202511345770',
        invoiceId: '10033303912530801697'
      }
    }
  });

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <User className="h-5 w-5" /> },
    { id: 'progress', name: 'Progress', icon: <Award className="h-5 w-5" /> },
    { id: 'attendance', name: 'Attendance', icon: <CheckCircle className="h-5 w-5" /> },
    { id: 'payment', name: 'Payment', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'assignments', name: 'Assignments', icon: <FileText className="h-5 w-5" /> },
    { id: 'quiz', name: 'Quiz', icon: <BookOpen className="h-5 w-5" /> }
  ];

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const currentDay = currentDate.getDate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Aun Abbas</h1>
                <p className="text-sm text-gray-600">Roll: {studentData.course.rollNumber}</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attendance Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {studentData.attendance.present}/{studentData.attendance.total}
                    </p>
                    <p className="text-sm text-gray-600">Attendance</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Assignments Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {studentData.assignments.completed}/{studentData.assignments.total}
                    </p>
                    <p className="text-sm text-gray-600">Assignment</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Course */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Course</h2>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {studentData.course.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{studentData.course.code}</p>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {studentData.course.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-2 mb-4">
                  {studentData.course.schedule.map((time, index) => (
                    <div key={index} className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-700">
                      {time}
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{studentData.course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${studentData.course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>Batch: {studentData.course.batch}</div>
                  <div>Roll: {studentData.course.rollNumber}</div>
                </div>
              </div>
            </div>

            {/* Fee Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Fee</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-900">
                    {studentData.fees.november.month}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {studentData.fees.november.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Due:</span>
                    <span>{studentData.fees.november.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>{studentData.fees.november.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Voucher ID:</span>
                    <span className="font-mono">{studentData.fees.november.voucherId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IBill Invoice:</span>
                    <span className="font-mono">{studentData.fees.november.invoiceId}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Click to pay
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Class Schedule */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Class Schedule</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    ←
                  </button>
                  <span className="font-medium text-gray-900">{currentMonth}</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    →
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs text-gray-600 font-medium py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(date => (
                    <div 
                      key={date} 
                      className={`text-center text-sm py-2 rounded cursor-pointer ${
                        date === currentDay 
                          ? 'bg-green-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {date}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                    Assignments
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Quizzes
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                    Events
                  </button>
                </div>
                <div className="text-center text-sm text-gray-500 mt-4">
                  No upcoming quizzes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg ${
                activeTab === tab.id 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default StudentPortal;