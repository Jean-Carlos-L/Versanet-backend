import { CustomerRepository } from "../../../../infrastructure/repositories/customerRepository.js";

class Handler {
  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  setNext(next) {
    this.next = next;
    return next;
  }
  async handle(reqBody) {
    if (this.next) return this.next.handle(reqBody);
    return { ok: true };
  }
}

class RequiredFieldsHandler extends Handler {
  async handle(body) {
    const { name, email, phone, document, address } = body;
    if (!name || !email || !phone || !document || !address)
      return {
        ok: false,
        error: "name, email, phone, document and address are required",
      };
    return super.handle(body);
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

class PhoneFormatHandler extends Handler {
  async handle(body) {
    const { phone } = body;
    const re = /^\+?[1-9]\d{1,14}$/; // E.164 format
    if (!re.test(phone)) return { ok: false, error: "invalid phone format" };
    return super.handle(body);
  }
}

class UniqueEmailHandler extends Handler {
  async handle(body) {
    const customer = await this.customerRepository.findByEmail(body.email);
    if (customer && customer.id !== body.id) return { ok: false, error: "email already registered" };
    return super.handle(body);
  }
}

class UniqueDocumentHandler extends Handler {
  async handle(body) {
    const customer = await this.customerRepository.findByDocument(body.document);
    if (customer && customer.id !== body.id) return { ok: false, error: "document already registered" };
    return super.handle(body);
  }
}

function buildEditValidatorChain() {
  const a = new RequiredFieldsHandler();
  const b = new EmailFormatHandler();
  const c = new PhoneFormatHandler();
  const d = new UniqueEmailHandler();

  a.setNext(b).setNext(c).setNext(d);
  return a;
}

export { buildEditValidatorChain };