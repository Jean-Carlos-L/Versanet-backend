import { RoleRepository } from "../../../infrastructure/repositories/roleRepository.js";

const roleRepository = new RoleRepository();

async function getRoleById(roleId) {
  const role = await roleRepository.findById(roleId);
  return role;
}

export { getRoleById };
