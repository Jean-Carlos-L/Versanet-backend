import { RoleRepository } from "../../../infrastructure/repositories/roleRepository.js";
import { RoleModel } from "../../../infrastructure/models/index.js";

const roleRepository = new RoleRepository();

async function deleteRole(roleId, actor = null) {
  const existingRole = await roleRepository.findById(roleId);
  if (!existingRole) {
    const error = new Error("El rol no existe.");
    error.status = 404;
    throw error;
  }

  const t = await RoleModel.sequelize.transaction();
  try {
    await roleRepository.delete(roleId, actor, { transaction: t });
    await t.commit();
    return { message: "Rol eliminado exitosamente." };
  } catch (error) {
    try {
      await t.rollback();
    } catch (rbErr) {
      console.error('deleteRole - rollback failed:', rbErr && rbErr.message ? rbErr.message : rbErr);
    }
    throw error;
  }
}

export { deleteRole };