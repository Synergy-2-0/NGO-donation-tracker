import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // use App Password for Gmail
  }
});

const templates = {
  pledge_created: (data) => ({
    subject: 'Your Pledge Has Been Received – Thank You!',
    html: `
      <h2>Dear ${data.donorName},</h2>
      <p>Thank you for your generous pledge of <strong>$${data.amount}</strong> (${data.frequency}).</p>
      <p>Your contribution makes a real difference. We'll keep you updated on the impact.</p>
      <br/>
      <p>Warm regards,<br/>The NGO Team</p>
    `
  }),
  donor_welcome: (data) => ({
    subject: 'Welcome to Our Donor Community!',
    html: `
      <h2>Welcome, ${data.donorName}!</h2>
      <p>We're thrilled to have you as part of our donor community.</p>
      <p>Your support helps us make a lasting impact.</p>
      <br/>
      <p>Warm regards,<br/>The NGO Team</p>
    `
  }),
  pledge_reminder: (data) => ({
    subject: 'Pledge Reminder',
    html: `
      <h2>Dear ${data.donorName},</h2>
      <p>This is a friendly reminder about your pending pledge of <strong>$${data.amount}</strong>.</p>
      <br/>
      <p>Warm regards,<br/>The NGO Team</p>
    `
  })
};

export const sendDonorEmail = async (to, templateKey, data) => {
  if (!to) throw new Error('Recipient email is required');
  if (!templates[templateKey]) throw new Error(`Unknown email template: ${templateKey}`);

  const { subject, html } = templates[templateKey](data);

  const mailOptions = {
    from: `"NGO Donation Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  return await transporter.sendMail(mailOptions);
};