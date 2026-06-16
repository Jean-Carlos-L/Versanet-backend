import { RoleRepository } from "../../../../infrastructure/repositories/roleRepository.js";
import { PermissionRepository } from "../../../../infrastructure/repositories/permissionRepository.js";

class Handler {
  constructor() {
    this.roleRepository = new RoleRepository();
    this.permissionRepository = new PermissionRepository();
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
    const { description, permissions } = body;
    if (!description || !permissions)
      return {
        ok: false,
        error: "description and permissions are required",
      };
    return super.handle(body);
  }
}

class UniqueDescriptionHandler extends Handler {
  async handle(body) {
    const role = await this.roleRepository.findByDescription(body.description);
    if (role) return { ok: false, error: "description already registered" };
    return super.handle(body);
  }
}

class ValidPermissionsHandler extends Handler {
  async handle(body) {
    const permissions = await this.permissionRepository.findByIds(
      body.permissions
    );
    if (permissions.length !== body.permissions.length)
      return { ok: false, error: "invalid permissions" };
    return super.handle(body);
  }
}

function buildRegisterValidatorChain() {
  const a = new RequiredFieldsHandler();
  const c = new UniqueDescriptionHandler();
  const b = new ValidPermissionsHandler();

  a.setNext(b).setNext(c);
  return a;
}

export { buildRegisterValidatorChain };
