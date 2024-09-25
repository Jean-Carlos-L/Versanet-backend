import { UserRepository } from "../repositories/user.repository.js";
import { userAdapterDTO, userAdapterEntity } from "../adapters/user.adapter.js";
import { RoleService } from "../../roles/services/role.services.js";
import { encryptPassword } from "../../../common/utils/password.util.js";

export class UserService {
  static async createUser(user) {
    try {
      const passwordSecret = await encryptPassword(user.password);
      await UserRepository.createUser(
        userAdapterEntity({
          ...user,
          password: passwordSecret,
        })
      );
      return { message: "Usuario creado con éxito" };
    } catch (error) {
      throw new Error("Error al crear el usuario: " + error.message);
    }
  }

  static async updateUser(id, user) {
    try {
      if (user.password) {
        const passwordSecret = await encryptPassword(user.password);
        user.password = passwordSecret;
      }
      await UserRepository.updateUser(id, userAdapterEntity(user));
      return { message: "Usuario actualizado con éxito" };
    } catch (error) {
      throw new Error("Error al actualizar el usuario: " + error.message);
    }
  }

  static async findById(id) {
    try {
      const user = await UserRepository.findById(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      const userDTO = userAdapterDTO(user[0]);
      const role = await RoleService.findById(userDTO.role);
      const userRole = { ...userDTO, role };
      return userRole;
    } catch (error) {
      throw new Error("Error al obtener el usuario: " + error.message);
    }
  }

  static async findAll() {
    try {
      const users = await UserRepository.findAll();
      const usersWithRoles = await Promise.all(
        users.map(async (user) => {
          const userDTO = userAdapterDTO(user);
          const role = await RoleService.findById(userDTO.role);
          return { ...userDTO, role };
        })
      );

      return usersWithRoles;
    } catch (error) {
      throw new Error("Error al obtener los usuarios: " + error.message);
    }
  }

  static async deleteUser(id) {
    try {
      await UserRepository.deleteUser(id);
      return { message: "Usuario eliminado con éxito" };
    } catch (error) {
      throw new Error("Error al eliminar el usuario: " + error.message);
    }
  }
}
