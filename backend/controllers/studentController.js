import Student from '../models/Student.js';
import Course from '../models/Course.js';

export const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('courseSelection.selectedCourse')
      .populate('user', 'email emailVerified');

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json({ student });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch student profile', 
      error: error.message 
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    if (student.status === 'enrolled') {
      return res.status(400).json({ 
        message: 'Cannot update profile after enrollment' 
      });
    }

    const allowedUpdates = [
      'personalInfo.phone',
      'personalInfo.address',
      'personalInfo.city',
      'documents.profilePicture'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    Object.assign(student, updates);
    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .populate('courseSelection.selectedCourse')
      .populate('user', 'email emailVerified');

    res.json({
      message: 'Profile updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update profile', 
      error: error.message 
    });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .select('enrollment.attendance enrollment.rollNumber');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      attendance: student.enrollment.attendance || [],
      rollNumber: student.enrollment.rollNumber
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch attendance', 
      error: error.message 
    });
  }
};

export const getMyAssignments = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('courseSelection.selectedCourse', 'name assignments')
      .select('courseSelection.submittedAssignments');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const course = student.courseSelection.selectedCourse;
    const submittedAssignments = student.courseSelection.submittedAssignments || [];

    const assignments = course.assignments?.map(assignment => ({
      ...assignment.toObject(),
      submitted: submittedAssignments.some(sub => 
        sub.assignmentId.toString() === assignment._id.toString()
      ),
      submittedAt: submittedAssignments.find(sub => 
        sub.assignmentId.toString() === assignment._id.toString()
      )?.submittedAt
    })) || [];

    res.json({ assignments });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch assignments', 
      error: error.message 
    });
  }
};

export const getMyFees = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .select('paymentInfo enrollment.rollNumber');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      paymentInfo: student.paymentInfo,
      rollNumber: student.enrollment.rollNumber
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch fee information', 
      error: error.message 
    });
  }
};

export const getMySchedule = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('courseSelection.selectedCourse', 'name schedule instructor')
      .select('enrollment.batchNumber');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const course = student.courseSelection.selectedCourse;

    res.json({
      course: {
        name: course.name,
        schedule: course.schedule,
        instructor: course.instructor
      },
      batchNumber: student.enrollment.batchNumber
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch schedule', 
      error: error.message 
    });
  }
};