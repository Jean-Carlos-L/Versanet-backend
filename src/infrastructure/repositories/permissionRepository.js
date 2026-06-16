import PermissionEntity from "../../domain/entities/Permission.js";
import { PermissionModel } from "../models/permissionModel.js";

export class PermissionRepository {
  async findByCode(code) {
    const permissionRecord = await PermissionModel.findOne({
      where: { codigo: code, eliminado: false },
    });
    if (!permissionRecord) return null;
    return new PermissionEntity({
      id: permissionRecord.id,
      description: permissionRecord.descripcion,
      code: permissionRecord.codigo,
    });
  }

  async findById(permissionId) {
    const permissionRecord = await PermissionModel.findOne({
      where: { id: permissionId, eliminado: false },
    });

    if (!permissionRecord) return null;

    return new PermissionEntity({
      id: permissionRecord.id,
      description: permissionRecord.descripcion,
      code: permissionRecord.codigo,
    });
  }

  async findAll() {
    const permissionRecords = await PermissionModel.findAll({
      where: { eliminado: false },
    });
    return permissionRecords.map(
      (permissionRecord) =>
        new PermissionEntity({
          id: permissionRecord.id,
          description: permissionRecord.descripcion,
          code: permissionRecord.codigo,
        })
    );
  }

  async findByIds(permissionIds) {
    const permissionRecords = await PermissionModel.findAll({
      where: { id: permissionIds, eliminado: false },
    });
    return permissionRecords.map(
      (permissionRecord) =>
        new PermissionEntity({
          id: permissionRecord.id,
          description: permissionRecord.descripcion,
          code: permissionRecord.codigo,
        })
    );
  }
}
