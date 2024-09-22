import { UserService } from "../services/createuser.service.js";

export class UserController {
  // Controlador para la creación de usuarios
  static async createUser(req, res) {
    try {
      const { nombres, correo_electronico, contrasena, idRol, estado } =
        req.body;

      // Llamar al servicio para crear el usuario
      await UserService.createUser({
        nombres,
        correo_electronico,
        contrasena,
        idRol,
        estado,
      });

      res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
      console.error("Error in createUser:", error);
      res
        .status(400)
        .json({ error: error.message || "No se pudo crear el usuario" });
    }
  }
}
