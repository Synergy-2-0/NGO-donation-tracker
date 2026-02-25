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

  async sendAgreementStatusChange(agreement, email, status) {
    if (!process.env.BREVO_API_KEY) {
      console.log('[EMAIL MOCK] Agreement status change sent to', email);
      return;
    }

    try {
      const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

      sendSmtpEmail.subject = `Agreement ${status}`;
      sendSmtpEmail.htmlContent = `
        <h3>Agreement Update</h3>
        <p>Your agreement <strong>${agreement.title}</strong> is now <strong>${status}</strong>.</p>
      `;
      sendSmtpEmail.sender = { name: 'NGO Tracker', email: 'luqmanbooso@gmail.com' };
      sendSmtpEmail.to = [{ email: email }];

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('[EMAIL] Agreement status sent to', email);
    } catch (error) {
      console.error('Email error:', error.message);
    }
  }
}

export default new EmailService();
