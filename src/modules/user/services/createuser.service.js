import { UserRepository } from "../repositories/createuser.repository.js";

export class UserService {
  // Función para crear un usuario
  static async createUser({
    nombres,
    correo_electronico,
    contrasena,
    idRol,
    estado,
  }) {
    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await UserRepository.getUserByEmail(
      correo_electronico
    );

    if (existingUser) {
      throw new Error("El correo electrónico ya está en uso.");
    }

    // Hash de la contraseña (puedes usar bcrypt u otro algoritmo de hashing, ejemplo con bcrypt)
    const hashedPassword = await bcrypt.hash(contrasena, 10); // Recuerda instalar `bcrypt` con `npm install bcrypt`

    // Crear el nuevo usuario
    return await UserRepository.createUser({
      id,
      nombres,
      correo_electronico,
      contrasena: hashedPassword,
      idRol,
      estado,
    });
  }
}
