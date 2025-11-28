import RoleEntity from "../../domain/entities/Role.js";
import PermissionEntity from "../../domain/entities/Permission.js";
import { RoleModel, PermissionModel } from "../models/index.js";
import ActivityLogRepository from "./activityLogRepository.js";

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

  async create(roleData, actor = null, options = {}) {
    const useExternalTx = !!options.transaction;
    const t = options.transaction || (await RoleModel.sequelize.transaction());
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

      if (!useExternalTx) await t.commit();

      const roleEntity = new RoleEntity({
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

      try {
        await ActivityLogRepository.create(
          {
            actor_id: actor?.id || null,
            actor_name: actor?.nombres || actor?.name || actor?.email || null,
            action: "create",
            entity: "role",
            entity_id: roleEntity.id,
            details: `${actor?.nombres || actor?.name || actor?.email || 'Usuario desconocido'} creó rol: id=${roleEntity.id}`,
            metadata: { data: roleEntity },
          },
          { transaction: t }
        );
      } catch (e) {
        console.error("roleRepository.create - activity log failed:", e && e.message ? e.message : e);
      }

      return roleEntity;
    } catch (error) {
      if (!useExternalTx) await t.rollback();
      console.error("Error creating role:", error && error.message ? error.message : error);
      throw error;
    }
  }

  async update(roleId, roleData, actor = null, options = {}) {
    const useExternalTx = !!options.transaction;
    const t = options.transaction || (await RoleModel.sequelize.transaction());
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

      if (!useExternalTx) await t.commit();

      const roleEntity = new RoleEntity({
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

      try {
        await ActivityLogRepository.create(
          {
            actor_id: actor?.id || null,
            actor_name: actor?.nombres || actor?.name || actor?.email || null,
            action: "update",
            entity: "role",
            entity_id: roleEntity.id,
            details: `${actor?.nombres || actor?.name || actor?.email || 'Usuario desconocido'} actualizó rol: id=${roleEntity.id}`,
            metadata: { data: roleEntity },
          },
          { transaction: t }
        );
      } catch (e) {
        console.error("roleRepository.update - activity log failed:", e && e.message ? e.message : e);
      }

      return roleEntity;
    } catch (error) {
      if (!useExternalTx) await t.rollback();
      console.error("Error updating role:", error && error.message ? error.message : error);
      throw error;
    }
  }

  async delete(roleId, actor = null, options = {}) {
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    const [deletedRowsCount] = await RoleModel.update(
      { eliminado: true },
      { where: { id: roleId, eliminado: false }, ...updateOpts }
    );

    const success = deletedRowsCount > 0;

    try {
      await ActivityLogRepository.create(
        {
          actor_id: actor?.id || null,
          actor_name: actor?.nombres || actor?.name || actor?.email || null,
          action: "delete",
          entity: "role",
          entity_id: roleId,
          details: `${actor?.nombres || actor?.name || actor?.email || 'Usuario desconocido'} eliminó rol: id=${roleId}`,
          metadata: { roleId, success },
        },
        { transaction: options.transaction }
      );
    } catch (e) {
      console.error("roleRepository.delete - activity log failed:", e && e.message ? e.message : e);
    }

    return success;
  }
}
