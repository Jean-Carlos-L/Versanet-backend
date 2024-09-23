import { PermissionRepository } from "../repositories/permission.repository.js";
import { permissionAdapterDTO } from "../adapters/permission.adapter.js";

export class PermissionService {
  static async findAll() {
    try {
      const permissions = await PermissionRepository.findAll();
      return permissions.map(permissionAdapterDTO);
    } catch (error) {
      console.error("Error al obtener los permisos", error);
      throw new Error("Error al obtener los permisos");
    }
  }
}
