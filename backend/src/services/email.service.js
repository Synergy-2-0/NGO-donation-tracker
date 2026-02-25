import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  async sendPartnerApproval(partner, email) {
    if (!process.env.RESEND_API_KEY) {
      console.log('[EMAIL MOCK] Partner approval sent to', email);
      return;
    }

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Partnership Approved - Welcome!',
        html: `
          <h1>Congratulations, ${partner.organizationName}!</h1>
          <p>Your partnership application has been approved.</p>
          <p>You can now create agreements and start collaborating.</p>
        `
      });
    } catch (error) {
      console.error('Email error:', error);
    }
  }

  async sendAgreementStatusChange(agreement, email, status) {
    if (!process.env.RESEND_API_KEY) {
      console.log('[EMAIL MOCK] Agreement status change sent to', email);
      return;
    }

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: `Agreement ${status}`,
        html: `
          <h3>Agreement Update</h3>
          <p>Your agreement <strong>${agreement.title}</strong> is now <strong>${status}</strong>.</p>
        `
      });
    } catch (error) {
      console.error('Email error:', error);
    }
  }

  async sendMilestoneReminder(milestone, email) {
    if (!process.env.RESEND_API_KEY) {
      console.log('[EMAIL MOCK] Milestone reminder sent to', email);
      return;
    }

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Milestone Due Soon',
        html: `
          <p>Reminder: Milestone <strong>${milestone.title}</strong> is due on <strong>${milestone.dueDate}</strong>.</p>
        `
      });
    } catch (error) {
      console.error('Email error:', error);
    }
  }
}

export default new EmailService();
