import { RegisterRoleDTO } from "../../../domain/dtos/registerRoleDTO.js";
import { RoleRepository } from "../../../infrastructure/repositories/roleRepository.js";

const roleRepository = new RoleRepository();

async function registerRole(userInput) {
  const roleDTO = new RegisterRoleDTO(userInput);

  let existingRole = await roleRepository.findByDescription(roleDTO.description);
  if (existingRole) {
    const error = new Error("El nombre del rol ya está registrado.");
    error.status = 400;
    throw error;
  }

  const result = await roleRepository.create(roleDTO);
  return result;
}

export { registerRole };
