import { generateToken } from "../../../common/utils/jwt.util.js";
import { comparePassword } from "../../../common/utils/password.util.js";
import { UserRepository } from "../../user/repositories/user.repository.js";
import { userAdapterDTO } from "../../user/adapters/user.adapter.js";
import { RolePermissionRepository } from "../../rolesPermissions/repositories/rolePermission.repository.js";
import { rolePermissionAdapterDTO } from "../../rolesPermissions/adapters/rolePermission.adapter.js";

export class AuthService {
  static async login(email, password) {
    try {
      const user = await UserRepository.findByEmail(email);

      if (!user) {
        throw new Error("Usuario no encontrado", 404);
      }
      const userDTO = userAdapterDTO(user[0]);

      const isValidPassword = await comparePassword(password, userDTO.password);
      if (!isValidPassword) {
        throw new Error("Contraseña incorrecta", 401);
      }
      const permissions = await RolePermissionRepository.findByRoleIds([
        userDTO.role,
      ]);
      const permissionsDTO = permissions.map((permission) =>
        rolePermissionAdapterDTO(permission)
      );

      const token = generateToken({
        id: userDTO.id,
        role: userDTO.role,
        permissions: permissionsDTO.map((permission) => permission.url),
      });

      return {
        user: {
          id: userDTO.id,
          name: userDTO.name,
          email: userDTO.email,
          permissions: permissionsDTO.map((permission) => permission.url),
        },
        token,
      };
    } catch (error) {
      throw new Error("Error al iniciar sesión: " + error.message);
    }
  }
}
