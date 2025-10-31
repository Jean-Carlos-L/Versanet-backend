import UserEntity from "../../domain/entities/User.js";
import RoleEntity from "../../domain/entities/Role.js";
import PermissionEntity from "../../domain/entities/Permission.js";
import { UserModel, RoleModel, PermissionModel} from "../models/index.js";

export class UserRepository {
  async create(userData) {
    const userRecord = await UserModel.create({
      id: userData.id,
      nombres: userData.name,
      correo_electronico: userData.email,
      contrasena: userData.passwordHash,
      rol_id: userData.role,
    });
    return new UserEntity({
      id: userRecord.id,
      name: userRecord.nombres,
      email: userRecord.correo_electronico,
      passwordHash: userRecord.contrasena,
      role: userRecord.rol_id,
    });
  }

  async update(userId, userData) {
    const userRecord = {
      nombres: userData.name,
      correo_electronico: userData.email,
      rol_id: userData.role,
    };

    if (userData.passwordHash) {
      userRecord.contrasena = userData.passwordHash;
    }

    const [updatedRowsCount] = await UserModel.update(userRecord, {
      where: { id: userId, eliminado: false },
    });

    let updatedUserRecord = null;
    if (updatedRowsCount === 0) {
      return null;
    }

    updatedUserRecord = await UserModel.findOne({
      where: { id: userId, eliminado: false },
    });

    return new UserEntity({
      id: updatedUserRecord.id,
      name: updatedUserRecord.nombres,
      email: updatedUserRecord.correo_electronico,
      passwordHash: updatedUserRecord.contrasena,
      role: updatedUserRecord.rol_id,
    });
  }

  async delete(userId) {
    const deletedRowsCount = await UserModel.update(
      { eliminado: true },
      { where: { id: userId, eliminado: false } }
    );
    return deletedRowsCount > 0;
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

  // Otros métodos del repositorio pueden ir aquí
}
