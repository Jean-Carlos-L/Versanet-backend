import { UserRepository } from "../../../../infrastructure/repositories/userRepository.js";
import {RoleRepository} from "../../../../infrastructure/repositories/roleRepository.js";

class Handler {
  constructor() {
    this.userRepository = new UserRepository();
    this.roleRepository = new RoleRepository(); 
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
    const { name, email, role } = body;
    if (!name || !email || !role)
      return {
        ok: false,
        error: "name, email and role are required",
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

class PasswordStrengthHandler extends Handler {
  async handle(body) {
    const { password } = body;
    if (password && password.length < 6)
      return { ok: false, error: "password too short (min 6)" };
    return super.handle(body);
  }
}

class UniqueEmailHandler extends Handler {
  async handle(body) {
    const user = await this.userRepository.findByEmail(body.email);

    if (user && user.id !== body.id) return { ok: false, error: "email already registered" };
    return super.handle(body);
  }
}

class ValidRoleHandler extends Handler {
  async handle(body) {
    const role = await this.roleRepository.findById(body.role);
    if (!role) return { ok: false, error: "invalid role" };
    return super.handle(body);
  }
}

function buildEditValidatorChain() {
  const a = new RequiredFieldsHandler();
  const b = new EmailFormatHandler();
  const c = new PasswordStrengthHandler();
  const d = new UniqueEmailHandler();
  const e = new ValidRoleHandler();

  a.setNext(b).setNext(c).setNext(d).setNext(e);
  return a;
}

export { buildEditValidatorChain };
