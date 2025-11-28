import UserEntity from "../../domain/entities/User.js";
import RoleEntity from "../../domain/entities/Role.js";
import PermissionEntity from "../../domain/entities/Permission.js";
import { UserModel, RoleModel, PermissionModel } from "../models/index.js";
import ActivityLogRepository from "./activityLogRepository.js";

export class UserRepository {
  async create(userData, actor = null, options = {}) {
    const createOpts = {};
    if (options.transaction) createOpts.transaction = options.transaction;

    const userRecord = await UserModel.create(
      {
        id: userData.id,
        nombres: userData.name,
        correo_electronico: userData.email,
        contrasena: userData.passwordHash,
        rol_id: userData.role,
      },
      createOpts
    );

    const resultEntity = new UserEntity({
      id: userRecord.id,
      name: userRecord.nombres,
      email: userRecord.correo_electronico,
      passwordHash: userRecord.contrasena,
      role: userRecord.rol_id,
    });

    try {
      await ActivityLogRepository.create(
        {
          actor_id: actor?.id || null,
          actor_name: actor?.nombres || actor?.name || actor?.email || null,
          action: "create",
          entity: "user",
          entity_id: resultEntity.id,
          details: `${actor?.nombres || actor?.name || actor?.email || 'Usuario desconocido'} creó usuario: id=${resultEntity.id}`,
          metadata: { data: resultEntity },
        },
        { transaction: options.transaction }
      );
    } catch (e) {
      console.error("userRepository.create - activity log failed:", e && e.message ? e.message : e);
      // don't fail the main operation because log failed; the transaction rollback will handle consistency if needed
    }

    return resultEntity;
  }

  async update(userId, userData, actor = null, options = {}) {
    const userRecord = {
      nombres: userData.name,
      correo_electronico: userData.email,
      rol_id: userData.role,
      codigo_recuperacion: userData.recoveryCode
    };

    if (userData.passwordHash) {
      userRecord.contrasena = userData.passwordHash;
    }

    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    const [updatedRowsCount] = await UserModel.update(userRecord, {
      where: { id: userId, eliminado: false },
      ...updateOpts,
    });

    let updatedUserRecord = null;
    if (updatedRowsCount === 0) {
      return null;
    }

    updatedUserRecord = await UserModel.findOne({
      where: { id: userId, eliminado: false },
      transaction: options.transaction,
    });

    const resultEntity = new UserEntity({
      id: updatedUserRecord.id,
      name: updatedUserRecord.nombres,
      email: updatedUserRecord.correo_electronico,
      passwordHash: updatedUserRecord.contrasena,
      role: updatedUserRecord.rol_id,
      recoveryCode: updatedUserRecord.codigo_recuperacion,
    });

    try {
      await ActivityLogRepository.create(
        {
          actor_id: actor?.id || null,
          actor_name: actor?.nombres || actor?.name || actor?.email || null,
          action: "update",
          entity: "user",
          entity_id: resultEntity.id,
          details: `${actor?.nombres || actor?.name || actor?.email || 'Usuario desconocido'} actualizó usuario: id=${resultEntity.id}`,
          metadata: { data: resultEntity },
        },
        { transaction: options.transaction }
      );
    } catch (e) {
      console.error("userRepository.update - activity log failed:", e && e.message ? e.message : e);
    }

    return resultEntity;
  }

  async delete(userId, actor = null, options = {}) {
    const updateOpts = {};
    if (options.transaction) updateOpts.transaction = options.transaction;

    const [deletedRowsCount] = await UserModel.update(
      { eliminado: true },
      { where: { id: userId, eliminado: false }, ...updateOpts }
    );

    const success = deletedRowsCount > 0;

    try {
      await ActivityLogRepository.create(
        {
          actor_id: actor?.id || null,
          actor_name: actor?.nombres || actor?.name || actor?.email || null,
          action: "delete",
          entity: "user",
          entity_id: userId,
          details: `${actor?.nombres || actor?.name || actor?.email || 'Usuario desconocido'} eliminó usuario: id=${userId}`,
          metadata: { userId, success },
        },
        { transaction: options.transaction }
      );
    } catch (e) {
      console.error("userRepository.delete - activity log failed:", e && e.message ? e.message : e);
    }

    return success;
  }

  async findByEmail(email) {
    const userRecord = await UserModel.findOne({
      where: { correo_electronico: email, eliminado: false },
      include: [
        {
          model: RoleModel,
          as: "role",
          include: [{ model: PermissionModel, as: "permissions", required: false }],
        },
      ],
    });
    if (!userRecord) return null;
    return new UserEntity({
      id: userRecord.id,
      name: userRecord.nombres,
      email: userRecord.correo_electronico,
      passwordHash: userRecord.contrasena,
      recoveryCode: userRecord.codigo_recuperacion,
      role: new RoleEntity({
        id: userRecord.role.id,
        description: userRecord.role.descripcion,
        status: userRecord.role.estado,
        permissions: userRecord.role.permissions.map(
          (permission) =>
            new PermissionEntity({
              id: permission.id,
              description: permission.descripcion,
              code: permission.codigo,
            })
        ),
      }),
    });
  }

  async findAll({ filters = {}, offset = 0, limit = 10 } = {}) {
    const userRecords = await UserModel.findAll({
      where: { eliminado: false, ...filters },
      offset,
      limit,
      include: [
        {
          model: RoleModel,
          as: "role",
          include: [{ model: PermissionModel, as: "permissions", required: false }],
        },
      ],
    });
    return userRecords.map(
      (userRecord) =>
        new UserEntity({
          id: userRecord.id,
          name: userRecord.nombres,
          email: userRecord.correo_electronico,
          passwordHash: userRecord.contrasena,
          recoveryCode: userRecord.codigo_recuperacion,
          role: new RoleEntity({
            id: userRecord.role.id,
            description: userRecord.role.descripcion,
            status: userRecord.role.estado,
            permissions: userRecord.role.permissions.map(
              (permission) =>
                new PermissionEntity({
                  id: permission.id,
                  description: permission.descripcion,
                  code: permission.codigo,
                })
            ),
          }),
        })
    );
  }

  async count({ filters = {} } = {}) {
    const count = await UserModel.count({
      where: { eliminado: false, ...filters },
    });
    return count;
  }

  async findById(userId) {
    const userRecord = await UserModel.findOne({
      where: { id: userId, eliminado: false },
      include: [
        {
          model: RoleModel,
          as: "role",
          include: [{ model: PermissionModel, as: "permissions", required: false }],
        },
      ],
    });

    if (!userRecord) return null;

    return new UserEntity({
      id: userRecord.id,
      name: userRecord.nombres,
      email: userRecord.correo_electronico,
      passwordHash: userRecord.contrasena,
      recoveryCode: userRecord.codigo_recuperacion,
      role: new RoleEntity({
        id: userRecord.role.id,
        description: userRecord.role.descripcion,
        status: userRecord.role.estado,
        permissions: userRecord.role.permissions.map(
          (permission) =>
            new PermissionEntity({
              id: permission.id,
              description: permission.descripcion,
              code: permission.codigo,
            })
        ),
      }),
    });
  }

  async updateRecoveryCode(userId, code) {
    const [updatedRowsCount] = await UserModel.update(
      { codigo_recuperacion: code },
      { where: { id: userId, eliminado: false } }
    );
    return updatedRowsCount > 0;
  }

  async updatePassword(userId, hashedPassword) {
    const [updatedRowsCount] = await UserModel.update(
      { contrasena: hashedPassword },
      { where: { id: userId, eliminado: false } }
    );
    return updatedRowsCount > 0;
  }
}
