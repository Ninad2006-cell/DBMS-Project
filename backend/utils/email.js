import nodemailer from 'nodemailer';

// Create email transporter using environment variables
// Supports Brevo, Gmail, or any SMTP provider
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send application submitted email
export async function sendApplicationSubmittedEmail(to, studentName, scholarshipName) {
  const mailOptions = {
    from: `"ScholarSphere" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject: 'Application Submitted Successfully - ScholarSphere',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">Hello ${studentName},</h2>
        <p>Your application for <strong>${scholarshipName}</strong> has been successfully submitted!</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Application Status:</strong> Under Review</p>
          <p style="margin: 10px 0 0 0;">We will notify you once your application has been reviewed by the admin team.</p>
        </div>
        <p>You can track your application status in your dashboard.</p>
        <p style="color: #666;">Thank you for using ScholarSphere!<br>Best regards,<br>ScholarSphere Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Application submitted email sent to ${to}`);
  } catch (error) {
    console.error('Error sending application submitted email:', error.message);
  }
}

// Send application approved email
export async function sendApplicationApprovedEmail(to, studentName, scholarshipName) {
  const mailOptions = {
    from: `"ScholarSphere" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject: 'Congratulations! Application Approved - ScholarSphere',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #166534;">Congratulations ${studentName}!</h2>
        <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #166534; font-size: 18px;"><strong>Your application has been APPROVED!</strong></p>
        </div>
        <p>Your application for <strong>${scholarshipName}</strong> has been approved by the admin team.</p>
        <p>Please check your dashboard for more details about the next steps.</p>
        <p style="color: #666;">Congratulations again!<br>Best regards,<br>ScholarSphere Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Application approved email sent to ${to}`);
  } catch (error) {
    console.error('Error sending application approved email:', error.message);
  }
}

// Send application rejected email
export async function sendApplicationRejectedEmail(to, studentName, scholarshipName, adminNotes = '') {
  const mailOptions = {
    from: `"ScholarSphere" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject: 'Application Status Update - ScholarSphere',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #991b1b;">Hello ${studentName},</h2>
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #991b1b; font-size: 18px;"><strong>Your application was not approved</strong></p>
        </div>
        <p>We regret to inform you that your application for <strong>${scholarshipName}</strong> has been rejected.</p>
        ${adminNotes ? `<div style="background: #f9fafb; padding: 15px; border-left: 4px solid #ef4444; margin: 15px 0;"><strong>Reason:</strong> ${adminNotes}</div>` : ''}
        <p>If you have any questions, please contact the scholarship administration office.</p>
        <p style="color: #666;">Thank you for your interest.<br>Best regards,<br>ScholarSphere Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Application rejected email sent to ${to}`);
  } catch (error) {
    console.error('Error sending application rejected email:', error.message);
  }
}
