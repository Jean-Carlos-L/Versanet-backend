import { UserRepository } from "../repositories/user.repository.js";
import { userAdapterDTO, userAdapterEntity } from "../adapters/user.adapter.js";
import { RoleService } from "../../roles/services/role.services.js";

export class UserService {
    // Crear un usuario
    static async createUser(user) {
        try {
            await UserRepository.createUser(userAdapterEntity(user));
            return { message: "Usuario creado con éxito" };
        } catch (error) {
            throw new Error("Error al crear el usuario: " + error.message);
        }
    }

    // Actualizar un usuario
    static async updateUser(user) {
        try {
            await UserRepository.updateUser(userAdapterEntity(user));
            return { message: "Usuario actualizado con éxito" };
        } catch (error) {
            throw new Error("Error al actualizar el usuario: " + error.message);
        }
    }

    // Buscar un usuario por ID
    static async findById(id) {
        try {
            const user = await UserRepository.findById(id);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            return userAdapterDTO(user);
        } catch (error) {
            throw new Error("Error al obtener el usuario: " + error.message);
        }
    }

    // Obtener todos los usuarios
    static async findAll() {
        try {
            const users = await UserRepository.findAll();
            const userwithrol = users.map(async user => {
                const role = await RoleService.findById(user.idRol);
                return { ...user, role: role };
            });
            return users.map(user => userAdapterDTO(user));
        } catch (error) {
            throw new Error("Error al obtener los usuarios: " + error.message);
        }
    }

    // Eliminar un usuario
    static async deleteUser(id) {
        try {
            await UserRepository.deleteUser(id);
            return { message: "Usuario eliminado con éxito" };
        } catch (error) {
            throw new Error("Error al eliminar el usuario: " + error.message);
        }
    }
}
