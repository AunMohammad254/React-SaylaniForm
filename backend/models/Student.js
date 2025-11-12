import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationNumber: {
    type: String,
    unique: true,
    required: true
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    fatherName: {
      type: String,
      required: true,
      trim: true
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{13}$/
    },
    fatherCnic: {
      type: String,
      match: /^[0-9]{13}$/
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10,15}$/
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  educationalBackground: {
    lastQualification: {
      type: String,
      required: true
    },
    computerProficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    hasLaptop: {
      type: Boolean,
      required: true
    }
  },
  courseSelection: {
    selectedCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    classPreference: {
      type: String,
      enum: ['Morning', 'Evening', 'Weekend'],
      required: true
    }
  },
  documents: {
    profilePicture: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'enrolled'],
    default: 'pending'
  },
  enrollment: {
    batchNumber: String,
    rollNumber: String,
    enrolledAt: Date,
    campus: String
  },
  paymentInfo: {
    totalFees: {
      type: Number,
      default: 0
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid'],
      default: 'pending'
    }
  }
}, {
  timestamps: true
});

studentSchema.pre('save', async function(next) {
  if (!this.registrationNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({});
    this.registrationNumber = `SMIT${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Student', studentSchema);