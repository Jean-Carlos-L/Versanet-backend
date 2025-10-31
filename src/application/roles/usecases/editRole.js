import { EditRoleDTO } from "../../../domain/dtos/editRoleDTO.js";
import { RoleRepository } from "../../../infrastructure/repositories/roleRepository.js";

const roleRepository = new RoleRepository();

async function editRole(roleId, userInput) {
  const roleDTO = new EditRoleDTO(userInput);
  console.log(roleDTO);

  const existingRole = await roleRepository.findById(roleId);
  if (!existingRole) {
    const error = new Error("El rol no existe.");
    error.status = 404;
    throw error;
  }

  if (roleDTO.name && roleDTO.name !== existingRole.name) {
    const roleWithSameName = await roleRepository.findByName(roleDTO.name);
    if (roleWithSameName) {
      const error = new Error("El nombre del rol ya está registrado.");
      error.status = 400;
      throw error;
    }
  }

  const result = await roleRepository.update(roleId, roleDTO);
  return result;
}

export { editRole };
