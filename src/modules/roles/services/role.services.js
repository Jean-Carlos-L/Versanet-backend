import { RoleRepository } from "../repositories/role.repository.js";
import { roleAdapterDTO, roleAdapterEntity } from "../adapters/role.adapter.js";
import { RolePermissionService } from "../../rolesPermissions/services/rolePermission.service.js";

export class RoleService {
  static async create(role) {
    try {
      const { permissions } = role;
      const roleId = await RoleRepository.create(roleAdapterEntity(role));

      if (permissions) {
        for (const permission of permissions) {
          await RolePermissionService.create({
            roleId: roleId,
            permissionId: permission,
          });
        }
      }

      return roleId;
    } catch (error) {
      console.error("Error al crear el rol", error);
      throw new Error("Error al crear el rol");
    }
  }

  static async update(id, role) {
    try {
      const { permissions } = role;
      await RoleRepository.update(id, roleAdapterEntity(role));

      await RolePermissionService.deleteByRoleId(id);
      if (permissions) {
        for (const permission of permissions) {
          await RolePermissionService.create({
            roleId: id,
            permissionId: permission,
          });
        }
      }
    } catch (error) {
      console.error("Error al actualizar el rol", error);
      throw new Error("Error al actualizar el rol");
    }
  }

  static async findById(id) {
    try {
      const role = await RoleRepository.findById(id);
      const permissions = await RolePermissionService.findByRoleIds([id]);

      return roleAdapterDTO({
        ...role,
        permissions,
      });
    } catch (error) {
      console.error("Error al obtener el rol", error);
      throw new Error("Error al obtener el rol");
    }
  }

  static async findAll() {
    try {
      const roles = await RoleRepository.findAll();
      const rolesIds = roles.map((role) => role.id);
      const permissions = await RolePermissionService.findByRoleIds(rolesIds);
      const rolesWithPermissions = roles.map((role) => {
        const rolePermissions = permissions.filter(
          (permission) => permission.roleId === role.id
        );
        return {
          ...role,
          permissions: rolePermissions,
        };
      });
      return rolesWithPermissions.map((role) => roleAdapterDTO(role));
    } catch (error) {
      console.error("Error al obtener los roles", error);
      throw new Error("Error al obtener los roles");
    }
  }

  static async delete(id) {
    try {
      await RoleRepository.delete(id);
    } catch (error) {
      console.error("Error al eliminar el rol", error);
      throw new Error("Error al eliminar el rol");
    }
  }
}
