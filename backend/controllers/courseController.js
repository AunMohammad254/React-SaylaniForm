import Course from '../models/Course.js';

export const getAllCourses = async (req, res) => {
  try {
    const { status, campus, city } = req.query;
    const query = {};

    if (status) query.status = status;
    if (campus) query.campus = campus;
    if (city) query.city = city;

    const courses = await Course.find(query)
      .sort({ name: 1 })
      .select('-__v');

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch courses', 
      error: error.message 
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .select('-__v');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch course', 
      error: error.message 
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to create course', 
      error: error.message 
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update course', 
      error: error.message 
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete course', 
      error: error.message 
    });
  }
};