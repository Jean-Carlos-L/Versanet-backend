import { RolePermissionRepository } from "../repositories/rolePermission.repository.js";
import {
  rolePermissionAdapterDTO,
  rolePermissionAdapterEntity,
} from "../adapters/rolePermission.adapter.js";

export class RolePermissionService {
  static async create(rolePermission) {
    try {
      await RolePermissionRepository.create(
        rolePermissionAdapterEntity(rolePermission)
      );
    } catch (error) {
      console.error("Error al crear el permiso del rol", error);
      throw new Error("Error al crear el permiso del rol");
    }
  }

  static async findByRoleIds(ids) {
    try {
      const rolePermissions = await RolePermissionRepository.findByRoleIds(ids);
      return rolePermissions.map(rolePermissionAdapterDTO);
    } catch (error) {
      console.error("Error al obtener el permiso del rol", error);
      throw new Error("Error al obtener el permiso del rol");
    }
  }

  static async delete(id) {
    try {
      await RolePermissionRepository.delete(id);
    } catch (error) {
      console.error("Error al eliminar el permiso del rol", error);
      throw new Error("Error al eliminar el permiso del rol");
    }
  }

  static async deleteByRoleId(roleId) {
    try {
      await RolePermissionRepository.deleteByRoleId(roleId);
    } catch (error) {
      console.error("Error al eliminar el permiso del rol", error);
      throw new Error("Error al eliminar el permiso del rol");
    }
  }

  static async deleteByRoleIds(roleIds) {
    try {
      await RolePermissionRepository.deleteByRoleIds(roleIds);
    } catch (error) {
      console.error("Error al eliminar el permiso del rol", error);
      throw new Error("Error al eliminar el permiso del rol");
    }
  }
}
