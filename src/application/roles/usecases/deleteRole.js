import { RoleRepository } from "../../../infrastructure/repositories/roleRepository.js";

const roleRepository = new RoleRepository();

async function deleteRole(roleId) {
  const existingRole = await roleRepository.findById(roleId);
  if (!existingRole) {
    const error = new Error("El rol no existe.");
    error.status = 404;
    throw error;
  }

  await roleRepository.delete(roleId);
  return { message: "Rol eliminado exitosamente." };
}

export { deleteRole };