import nodemailer from 'nodemailer';
import { MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_SECURE, MAIL_USER, MAIL_FROM } from '../constants/mailConstants.js';

class Mailer {
  constructor() {
    if (Mailer.instance) return Mailer.instance;

    this.transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: MAIL_SECURE,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    Mailer.instance = this;
  }

  async sendMail({ to, subject, html, text, attachments }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${MAIL_FROM}" <${MAIL_USER}>`,
        to,
        subject,
        text,
        html,
        attachments,
      });
      console.log(`📧 Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('❌ Error sending email:', error.message);
      throw error;
    }
  }
}

export default new Mailer();