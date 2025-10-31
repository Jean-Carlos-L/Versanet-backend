import RoleEntity from "../../domain/entities/Role.js";
import PermissionEntity from "../../domain/entities/Permission.js";
import { RoleModel, PermissionModel } from "../models/index.js";

export class RoleRepository {
  async findByCode(code) {
    const roleRecord = await RoleModel.findOne({
      where: { codigo: code, eliminado: false },
      include: [{ model: PermissionModel, as: "permissions" }],
    });
    if (!roleRecord) return null;
    return new RoleEntity({
      id: roleRecord.id,
      description: roleRecord.descripcion,
      status: roleRecord.estado,
      permissions: roleRecord.permissions.map(
        (permission) =>
          new PermissionEntity({
            id: permission.id,
            description: permission.descripcion,
            code: permission.codigo,
          })
      ),
    });
  }

  async findById(roleId) {
    const roleRecord = await RoleModel.findOne({
      where: { id: roleId, eliminado: false },
      include: [{ model: PermissionModel, as: "permissions" }],
    });

    if (!roleRecord) return null;

    return new RoleEntity({
      id: roleRecord.id,
      description: roleRecord.descripcion,
      status: roleRecord.estado,
      permissions: roleRecord.permissions.map(
        (permission) =>
          new PermissionEntity({
            id: permission.id,
            description: permission.descripcion,
            code: permission.codigo,
          })
      ),
    });
  }

  async findAll() {
    const roleRecords = await RoleModel.findAll({
      where: { eliminado: false },
      include: [{ model: PermissionModel, as: "permissions" }],
    });
    return roleRecords.map(
      (roleRecord) =>
        new RoleEntity({
          id: roleRecord.id,
          description: roleRecord.descripcion,
          status: roleRecord.estado,
          permissions: roleRecord.permissions.map(
            (permission) =>
              new PermissionEntity({
                id: permission.id,
                description: permission.descripcion,
                code: permission.codigo,
              })
          ),
        })
    );
  }

  async count({ filters }) {
    const count = await RoleModel.count({
      where: { eliminado: false, ...filters },
    });
    return count;
  }

  async findByDescription(description) {
    const roleRecord = await RoleModel.findOne({
      where: {
        descripcion: description,
        eliminado: false,
      },
      include: [{ model: PermissionModel, as: "permissions" }],
    });

    if (!roleRecord) return null;
    return new RoleEntity({
      id: roleRecord.id,
      description: roleRecord.descripcion,
      status: roleRecord.estado,
      permissions: roleRecord.permissions.map(
        (permission) =>
          new PermissionEntity({
            id: permission.id,
            description: permission.descripcion,
            code: permission.codigo,
          })
      ),
    });
  }

  async create(roleData) {
    const t = await RoleModel.sequelize.transaction();
    try {
      // Create the role
      const roleRecord = await RoleModel.create(
        {
          descripcion: roleData.description,
        },
        { transaction: t }
      );

      // Associate permissions if provided
      if (roleData.permissions && roleData.permissions.length > 0) {
        const permissionIds = roleData.permissions;
        const permissions = await PermissionModel.findAll({
          where: {
            id: permissionIds,
            eliminado: false, // Only non-deleted permissions
          },
          transaction: t,
        });

        // Validate all permissions were found
        if (permissions.length !== permissionIds.length) {
          const foundIds = permissions.map((p) => p.id);
          const missingIds = permissionIds.filter(
            (id) => !foundIds.includes(id)
          );
          throw new Error(`Permissions not found: ${missingIds.join(", ")}`);
        }

        // Set permissions (creates entries in roles_permisos)
        await roleRecord.setPermissions(permissions, { transaction: t });
      }

      // Fetch the role with permissions for the response
      const createdRole = await RoleModel.findByPk(roleRecord.id, {
        include: [
          {
            model: PermissionModel,
            as: "permissions",
            through: { attributes: [] },
            where: { eliminado: false },
            required: false,
          },
        ],
        transaction: t, // Reuse transaction for consistency
      });

      await t.commit();

      return new RoleEntity({
        id: createdRole.id,
        description: createdRole.descripcion,
        status: createdRole.estado,
        permissions: createdRole.permissions.map(
          (permiso) =>
            new PermissionEntity({
              id: permiso.id,
              description: permiso.descripcion,
              code: permiso.codigo,
            })
        ),
      });
    } catch (error) {
      await t.rollback();
      console.error("Error creating role:", error.message);
      throw error;
    }
  }

  async update(roleId, roleData) {
    const t = await RoleModel.sequelize.transaction();
    try {
      // Update the role
      const [updatedRowsCount] = await RoleModel.update(
        {
          descripcion: roleData.description,
          estado: roleData.status,
        },
        {
          where: { id: roleId, eliminado: false },
          transaction: t,
        }
      );

      if (updatedRowsCount === 0) {
        await t.rollback();
        return null; // Role not found or soft-deleted
      }

      // Fetch the updated role record
      const updatedRoleRecord = await RoleModel.findByPk(roleId, {
        where: { eliminado: false },
        transaction: t,
      });

      if (!updatedRoleRecord) {
        await t.rollback();
        return null; // Should not happen due to update check, but added for safety
      }

      // Update permissions if provided
      if (roleData.permissions && roleData.permissions.length > 0) {
        const permissionIds = roleData.permissions;
        const permissions = await PermissionModel.findAll({
          where: {
            id: permissionIds,
            eliminado: false, // Only non-deleted permissions
          },
          transaction: t,
        });

        // Validate all permissions were found
        if (permissions.length !== permissionIds.length) {
          const foundIds = permissions.map((p) => p.id);
          const missingIds = permissionIds.filter(
            (id) => !foundIds.includes(id)
          );
          await t.rollback();
          throw new Error(`Permissions not found: ${missingIds.join(", ")}`);
        }

        // Set new permissions (replaces existing ones in roles_permisos)
        await updatedRoleRecord.setPermissions(permissions, { transaction: t });
      } else if (roleData.permissions && roleData.permissions.length === 0) {
        // If permissions array is empty, remove all existing permissions
        const existingPermissions = await updatedRoleRecord.getPermissions({
          attributes: ["id"],
          transaction: t,
        });
        if (existingPermissions.length > 0) {
          await updatedRoleRecord.setPermissions([], { transaction: t });
        }
      }

      // Fetch the role with permissions for the response
      const finalRoleRecord = await RoleModel.findByPk(roleId, {
        where: { eliminado: false },
        include: [
          {
            model: PermissionModel,
            as: "permissions",
            through: { attributes: [] },
            where: { eliminado: false },
            required: false,
          },
        ],
        transaction: t,
      });

      await t.commit();

      return new RoleEntity({
        id: finalRoleRecord.id,
        description: finalRoleRecord.descripcion,
        status: finalRoleRecord.estado,
        permissions: finalRoleRecord.permissions?.map(
          (permiso) =>
            new PermissionEntity({
              id: permiso.id,
              description: permiso.descripcion,
              code: permiso.codigo,
            })
        ),
      });
    } catch (error) {
      await t.rollback();
      console.error("Error updating role:", error.message);
      throw error;
    }
  }

  async delete(roleId) {
    const deletedRowsCount = await RoleModel.update(
      { eliminado: true },
      { where: { id: roleId, eliminado: false } }
    );
    return deletedRowsCount > 0;
  }
}
