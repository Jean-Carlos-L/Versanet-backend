import { UserService } from "../services/user.service.js";

export class UserController {
  static async listUsers(req, res) {
    try {
      const { page = 1, limit = 10, nombre, correo, rol } = req.query;
      const result = await UserService.getUsers({
        page,
        limit,
        nombre,
        correo,
        rol,
      });

      res.json(result);
    } catch (error) {
      console.error("Error in listUsers:", error);
      res.status(500).json({
        error: "Failed to list users",
      });
    }
  }
}
