import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  fees: {
    type: Number,
    required: true,
    min: 0
  },
  schedule: {
    type: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      }
    }],
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  campus: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  maxStudents: {
    type: Number,
    required: true,
    min: 1
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'full'],
    default: 'active'
  },
  prerequisites: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

courseSchema.methods.isFull = function() {
  return this.enrolledStudents >= this.maxStudents;
};

courseSchema.methods.getAvailableSeats = function() {
  return Math.max(0, this.maxStudents - this.enrolledStudents);
};

export default mongoose.model('Course', courseSchema);