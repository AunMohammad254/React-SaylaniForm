import Student from '../models/Student.js';
import Course from '../models/Course.js';
import { validationResult } from 'express-validator';

export const createRegistration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      personalInfo,
      educationalBackground,
      courseSelection,
      documents
    } = req.body;

    const existingStudent = await Student.findOne({
      $or: [
        { 'personalInfo.cnic': personalInfo.cnic },
        { user: req.user.id }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Student with this CNIC or user already exists' 
      });
    }

    const selectedCourse = await Course.findById(courseSelection.selectedCourse);
    if (!selectedCourse) {
      return res.status(400).json({ message: 'Selected course not found' });
    }

    if (selectedCourse.status !== 'active') {
      return res.status(400).json({ message: 'Selected course is not active' });
    }

    if (selectedCourse.isFull()) {
      return res.status(400).json({ message: 'Selected course is full' });
    }

    const student = new Student({
      user: req.user.id,
      personalInfo,
      educationalBackground,
      courseSelection,
      documents,
      status: 'pending'
    });

    await student.save();

    await Course.findByIdAndUpdate(
      courseSelection.selectedCourse,
      { $inc: { enrolledStudents: 1 } }
    );

    const populatedStudent = await Student.findById(student._id)
      .populate('courseSelection.selectedCourse')
      .populate('user', 'email');

    res.status(201).json({
      message: 'Registration submitted successfully',
      student: populatedStudent,
      registrationNumber: student.registrationNumber
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

export const getMyRegistration = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('courseSelection.selectedCourse')
      .populate('user', 'email emailVerified');

    if (!student) {
      return res.status(404).json({ message: 'No registration found' });
    }

    res.json({ student });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch registration', 
      error: error.message 
    });
  }
};

export const updateRegistration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (student.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot update registration after approval' 
      });
    }

    const allowedUpdates = [
      'personalInfo', 'educationalBackground', 'documents'
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
      .populate('user', 'email');

    res.json({
      message: 'Registration updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Update failed', 
      error: error.message 
    });
  }
};

export const getRegistrationStatus = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .select('status registrationNumber personalInfo.fullName')
      .populate('courseSelection.selectedCourse', 'name code');

    if (!student) {
      return res.status(404).json({ message: 'No registration found' });
    }

    res.json({
      status: student.status,
      registrationNumber: student.registrationNumber,
      studentName: student.personalInfo.fullName,
      course: student.courseSelection.selectedCourse
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch status', 
      error: error.message 
    });
  }
};