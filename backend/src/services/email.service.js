import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPaymentConfirmation = async (userEmail, transaction) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Impact Deployment Confirmed - TransFund',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 24px; overflow: hidden; background: #fff;">
        <div style="background: #0f172a; padding: 40px; text-align: center;">
          <h1 style="color: #ff8a00; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Payment Confirmed</h1>
          <p style="color: #64748b; margin-top: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Verified Humanitarian Capital Deployment</p>
        </div>
        <div style="padding: 40px;">
          <p style="font-size: 16px; color: #1e293b; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; color: #475569; line-height: 1.6;">Your contribution of <strong>LKR ${transaction.amount.toLocaleString()}</strong> has been successfully processed and verified. Every asset you deploy is tracked through our transparency engine.</p>
          
          <div style="background: #f8fafc; padding: 24px; border-radius: 16px; margin: 30px 0;">
            <p style="margin: 0; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Transaction Reference</p>
            <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 14px; color: #0f172a;">${transaction._id}</p>
            
            <p style="margin: 20px 0 0 0; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Project Supported</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #0f172a; font-weight: bold;">${transaction.campaignId?.title || 'General Humanitarian Fund'}</p>
          </div>
          
          <p style="font-size: 14px; color: #64748b; font-style: italic;">Thank you for your commitment to sustainable impact.</p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
          <p style="font-size: 10px; color: #cbd5e1; text-align: center; text-transform: uppercase; letter-spacing: 1px;">TransFund &copy; ${new Date().getFullYear()} - Institutional Grade Philanthropy</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Payment confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email Error:', error);
  }
};

export const sendPledgeReminder = async (userEmail, pledge, nextDate) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Upcoming Strategy Cycle Reminder - TransFund',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 24px; overflow: hidden; background: #fff;">
        <div style="background: #0f172a; padding: 40px; text-align: center;">
          <h1 style="color: #ff8a00; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Pledge Reminder</h1>
          <p style="color: #64748b; margin-top: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Strategic Mission Cycle: 1 Day Notice</p>
        </div>
        <div style="padding: 40px;">
          <p style="font-size: 16px; color: #1e293b; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; color: #475569; line-height: 1.6;">This is a courtesy notice that your scheduled contribution for <strong>${pledge.campaign?.title || 'a Strategic Mission'}</strong> is due tomorrow.</p>
          
          <div style="background: #f8fafc; padding: 24px; border-radius: 16px; margin: 30px 0;">
            <p style="margin: 0; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Scheduled Amount</p>
            <p style="margin: 5px 0 0 0; font-size: 18px; color: #0f172a; font-weight: bold;">LKR ${pledge.amount.toLocaleString()}</p>
            
            <p style="margin: 20px 0 0 0; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Mission Cycle Date</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #0f172a;">${nextDate.toLocaleDateString()}</p>
          </div>
          
          <p style="font-size: 14px; color: #64748b; font-style: italic;">Your consistent support ensures high-reliability operations for these vital missions.</p>
          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/pledges" style="background: #0f172a; color: #fff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Manage Support Plan</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
          <p style="font-size: 10px; color: #cbd5e1; text-align: center; text-transform: uppercase; letter-spacing: 1px;">TransFund &copy; ${new Date().getFullYear()} - Impact Orchestration Engine</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Pledge reminder email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email Error:', error);
  }
};

export const sendPartnerApproval = async (partner, userEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: userEmail,
    subject: 'Institutional Partnership Verified - TransFund',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 24px; overflow: hidden; background: #fff;">
        <div style="background: #0f172a; padding: 40px; text-align: center;">
          <h1 style="color: #ff8a00; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Partnership Approved</h1>
          <p style="color: #64748b; margin-top: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Official Humanitarian Partner Access Authorized</p>
        </div>
        <div style="padding: 40px;">
          <p style="font-size: 16px; color: #1e293b; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; color: #475569; line-height: 1.6;">We are pleased to inform you that your institutional partnership with TransFund has been verified. You now have full access to our project management and capital distribution framework.</p>
          
          <div style="background: #f8fafc; padding: 24px; border-radius: 16px; margin: 30px 0;">
            <p style="margin: 0; font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Organization</p>
            <p style="margin: 5px 0 0 0; font-size: 18px; color: #0f172a; font-weight: bold;">${partner.organizationName}</p>
          </div>
          
          <p style="font-size: 14px; color: #64748b; font-style: italic;">We look forward to collaborating on high-impact humanitarian missions.</p>
          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="background: #0f172a; color: #fff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Access Dashboard</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
          <p style="font-size: 10px; color: #cbd5e1; text-align: center; text-transform: uppercase; letter-spacing: 1px;">TransFund &copy; ${new Date().getFullYear()} - Institutional Philanthropy</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Partner approval email sent to:', userEmail);
  } catch (error) {
    console.error('Email Error:', error);
  }
};

const emailService = {
  sendPaymentConfirmation,
  sendPledgeReminder,
  sendPartnerApproval
};

export default emailService;
