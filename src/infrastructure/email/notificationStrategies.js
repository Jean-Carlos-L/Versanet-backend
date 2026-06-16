import mailer from "./mailer.js";

// EmailStrategy
class EmailStrategy {
  async send(notification) {
    const info = await mailer.sendMail(notification);
    return info;
  }
}

// LogStrategy (dev)
class LogStrategy {
  async send(notification) {
    console.log("--- LogStrategy send ---", notification);
    return { logged: true };
  }
}

export { EmailStrategy, LogStrategy };