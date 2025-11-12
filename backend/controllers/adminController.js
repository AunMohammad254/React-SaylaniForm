import Student from '../models/Student.js';
import Course from '../models/Course.js';
import { sendStatusUpdate, sendRegistrationConfirmation } from '../utils/email.js';

export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, course, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (course) query['courseSelection.selectedCourse'] = course;
    if (search) {
      query.$or = [
        { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
        { 'personalInfo.cnic': { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .populate('courseSelection.selectedCourse')
      .populate('user', 'email emailVerified')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch students', 
      error: error.message 
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('courseSelection.selectedCourse')
      .populate('user', 'email emailVerified');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch student', 
      error: error.message 
    });
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    const { status, enrollment, paymentInfo } = req.body;
    const { id } = req.params;

    const student = await Student.findById(id)
      .populate('courseSelection.selectedCourse')
      .populate('user');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const oldStatus = student.status;
    student.status = status;

    if (enrollment && status === 'enrolled') {
      student.enrollment = {
        ...enrollment,
        enrolledAt: new Date()
      };
    }

    if (paymentInfo) {
      student.paymentInfo = paymentInfo;
    }

    await student.save();

    if (oldStatus !== status) {
      await sendStatusUpdate(student);
    }

    res.json({
      message: 'Student status updated successfully',
      student
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update student status', 
      error: error.message 
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const pendingApplications = await Student.countDocuments({ status: 'pending' });
    const approvedApplications = await Student.countDocuments({ status: 'approved' });
    const enrolledStudents = await Student.countDocuments({ status: 'enrolled' });

    const courseStats = await Course.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: 'courseSelection.selectedCourse',
          as: 'enrolledStudents'
        }
      },
      {
        $project: {
          name: 1,
          code: 1,
          maxStudents: 1,
          enrolledCount: { $size: '$enrolledStudents' },
          availableSeats: { $subtract: ['$maxStudents', { $size: '$enrolledStudents' }] }
        }
      }
    ]);

    const recentApplications = await Student.find()
      .populate('courseSelection.selectedCourse', 'name code')
      .select('registrationNumber personalInfo.fullName status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalStudents,
        pendingApplications,
        approvedApplications,
        enrolledStudents
      },
      courseStats,
      recentApplications
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch dashboard stats', 
      error: error.message 
    });
  }
};

export const exportStudents = async (req, res) => {
  try {
    const { format = 'json', status, course } = req.query;
    const query = {};

    if (status) query.status = status;
    if (course) query['courseSelection.selectedCourse'] = course;

    const students = await Student.find(query)
      .populate('courseSelection.selectedCourse', 'name code')
      .populate('user', 'email')
      .lean();

    if (format === 'csv') {
      const csvData = students.map(student => ({
        'Registration Number': student.registrationNumber,
        'Full Name': student.personalInfo.fullName,
        'Father Name': student.personalInfo.fatherName,
        'CNIC': student.personalInfo.cnic,
        'Email': student.user.email,
        'Phone': student.personalInfo.phone,
        'Course': student.courseSelection.selectedCourse.name,
        'Status': student.status,
        'Registration Date': student.createdAt.toISOString().split('T')[0]
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
      
      const headers = Object.keys(csvData[0] || {});
      const csv = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');

      return res.send(csv);
    }

    res.json({ students });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to export students', 
      error: error.message 
    });
  }
};