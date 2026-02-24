import sgMail from '@sendgrid/mail';

class EmailService {
  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async sendPartnerApproval(partner, email) {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid not configured');
      return;
    }

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Partnership Approved - Welcome!',
      text: `Congratulations! Your partnership with ${partner.organizationName} has been approved.`,
      html: `<strong>Congratulations!</strong><p>Your partnership has been approved.</p>`
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('SendGrid error:', error.message);
    }
  }

  async sendAgreementStatusChange(agreement, email, status) {
    if (!process.env.SENDGRID_API_KEY) return;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `Agreement ${status}`,
      text: `Your agreement "${agreement.title}" is now ${status}.`
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('SendGrid error:', error.message);
    }
  }

  async sendMilestoneReminder(milestone, email) {
    if (!process.env.SENDGRID_API_KEY) return;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Milestone Due Soon',
      text: `Reminder: Milestone "${milestone.title}" is due on ${milestone.dueDate}.`
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('SendGrid error:', error.message);
    }
  }
}

export default new EmailService();
