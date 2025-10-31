import { MAIL_FROM } from "../constants/mailConstants.js";

// Builder para emails
export class NotificationBuilder {
  constructor() {
    this.mail = { from: MAIL_FROM };
  }

  to(address) { this.mail.to = address; return this; }
  subject(s) { this.mail.subject = s; return this; }
  text(t) { this.mail.text = t; return this; }
  html(h) { this.mail.html = h; return this; }
  cc(c) { this.mail.cc = c; return this; }
  attachments(att) { this.mail.attachments = att; return this; }

  build() { return this.mail; }
}