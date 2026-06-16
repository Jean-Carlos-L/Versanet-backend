class Handler {
  setNext(next) {
    this.next = next;
    return next;
  }

  async handle(reqBody) {
    if (this.next) return this.next.handle(reqBody);
    return { ok: true };
  }
}

class EmailFormatHandler extends Handler {
  async handle(body) {
    const { email } = body;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return { ok: false, error: "invalid email format" };
    return super.handle(body);
  }
}

class PasswordPresenceHandler extends Handler {
  async handle(body) {
    const { password } = body;
    if (!password) return { ok: false, error: "password is required" };
    return super.handle(body);
  }
}

function buildLoginValidatorChain() {
  const a = new EmailFormatHandler();
  const b = new PasswordPresenceHandler();

  a.setNext(b);
  return a;
}

export { buildLoginValidatorChain };
