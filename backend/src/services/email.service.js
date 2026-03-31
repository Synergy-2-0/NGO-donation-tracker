import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

class EmailService {
  async sendPartnerApproval(partner, email) {
    if (!process.env.BREVO_API_KEY) {
      console.log('[EMAIL MOCK] Partner approval sent to', email);
      return;
    }

    try {
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      sendSmtpEmail.subject = 'Partnership Approved - Welcome!';
      sendSmtpEmail.htmlContent = `
        <h1>Congratulations, ${partner.organizationName}!</h1>
        <p>Your partnership application has been approved.</p>
        <p>You can now create agreements and start collaborating.</p>
      `;
      sendSmtpEmail.sender = { name: 'NGO Tracker', email: 'luqmanbooso@gmail.com' };
      sendSmtpEmail.to = [{ email: email }];

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('[EMAIL] Partner approval sent to', email);
    } catch (error) {
      console.error('Email error:', error.message);
    }
  }

  async sendWelcomeEmail(user) {
    console.log(`[EMAIL MOCK] Welcome email sent to ${user.email}`);
  }

  async sendDonationReceipt(donorEmail, transaction) {
    console.log(`[EMAIL MOCK] Donation receipt for $${transaction.amount} sent to ${donorEmail}`);
  }

  async sendMilestoneNotification(email, milestone) {
    console.log(`[EMAIL MOCK] Milestone '${milestone.title}' completed notification sent to ${email}`);
  }

  async sendPledgeReminder(email, pledge) {
    console.log(`[EMAIL MOCK] Pledge reminder for $${pledge.amount} sent to ${email}`);
  }

  async sendCampaignUpdate(email, campaign, message) {
    console.log(`[EMAIL MOCK] Campaign update for '${campaign.title}' sent to ${email}: ${message}`);
  }
}

export default new EmailService();
