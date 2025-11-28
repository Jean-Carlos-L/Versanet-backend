import { RegisterRoleDTO } from "../../../domain/dtos/registerRoleDTO.js";
import { RoleRepository } from "../../../infrastructure/repositories/roleRepository.js";
import { RoleModel } from "../../../infrastructure/models/index.js";

const roleRepository = new RoleRepository();

async function registerRole(userInput, actor = null) {
  const roleDTO = new RegisterRoleDTO(userInput);

  let existingRole = await roleRepository.findByDescription(roleDTO.description);
  if (existingRole) {
    const error = new Error("El nombre del rol ya está registrado.");
    error.status = 400;
    throw error;
  }

  const t = await RoleModel.sequelize.transaction();
  try {
    const result = await roleRepository.create(roleDTO, actor, { transaction: t });
    await t.commit();
    return result;
  } catch (error) {
    try {
      await t.rollback();
    } catch (rbErr) {
      console.error('registerRole - rollback failed:', rbErr && rbErr.message ? rbErr.message : rbErr);
    }
    throw error;
  }
}

export { registerRole };
