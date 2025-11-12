// Simple email utility for development - replace with actual email service in production
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    console.log('=== EMAIL SENT (Development Mode) ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML:', html);
    console.log('Text:', text);
    console.log('=====================================');
    
    // Simulate email sending
    return { messageId: 'dev-' + Date.now() };
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

export const sendRegistrationConfirmation = async (student) => {
  const emailContent = `
    <h2>Registration Confirmation - Saylani SMIT</h2>
    <p>Dear ${student.personalInfo.fullName},</p>
    <p>Thank you for registering with Saylani SMIT. Your registration has been received and is under review.</p>
    <p><strong>Registration Number:</strong> ${student.registrationNumber}</p>
    <p><strong>Course Applied:</strong> ${student.courseSelection.selectedCourse.name}</p>
    <p><strong>Status:</strong> ${student.status}</p>
    <p>We will review your application and get back to you soon.</p>
    <p>Best regards,<br>Saylani SMIT Team</p>
  `;

  await sendEmail({
    to: student.user.email,
    subject: 'Registration Confirmation - Saylani SMIT',
    html: emailContent
  });
};

export const sendStatusUpdate = async (student) => {
  const statusMessages = {
    approved: 'Congratulations! Your registration has been approved.',
    rejected: 'We regret to inform you that your registration has been rejected.',
    enrolled: 'Welcome! You have been enrolled in the course.'
  };

  const emailContent = `
    <h2>Registration Status Update - Saylani SMIT</h2>
    <p>Dear ${student.personalInfo.fullName},</p>
    <p>${statusMessages[student.status]}</p>
    <p><strong>Registration Number:</strong> ${student.registrationNumber}</p>
    <p><strong>Course:</strong> ${student.courseSelection.selectedCourse.name}</p>
    <p><strong>New Status:</strong> ${student.status.toUpperCase()}</p>
    ${student.status === 'enrolled' ? `
      <p><strong>Batch:</strong> ${student.enrollment.batchNumber}</p>
      <p><strong>Roll Number:</strong> ${student.enrollment.rollNumber}</p>
    ` : ''}
    <p>Best regards,<br>Saylani SMIT Team</p>
  `;

  await sendEmail({
    to: student.user.email,
    subject: `Registration Status Update - ${student.status.toUpperCase()}`,
    html: emailContent
  });
};