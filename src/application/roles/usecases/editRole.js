import { EditRoleDTO } from "../../../domain/dtos/editRoleDTO.js";
import { RoleRepository } from "../../../infrastructure/repositories/roleRepository.js";
import { RoleModel } from "../../../infrastructure/models/index.js";

const roleRepository = new RoleRepository();

async function editRole(roleId, userInput, actor = null) {
  const roleDTO = new EditRoleDTO(userInput);

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

  const t = await RoleModel.sequelize.transaction();
  try {
    const result = await roleRepository.update(roleId, roleDTO, actor, { transaction: t });
    await t.commit();
    return result;
  } catch (error) {
    try {
      await t.rollback();
    } catch (rbErr) {
      console.error('editRole - rollback failed:', rbErr && rbErr.message ? rbErr.message : rbErr);
    }
    throw error;
  }
}

export { editRole };
