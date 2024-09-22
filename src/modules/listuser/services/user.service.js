import { UserRepository } from "../repositories/user.repository.js";

export class UserService {
  static async getUsers({ page, limit, nombre, correo, rol }) {
    const offset = (page - 1) * limit;
    const users = await UserRepository.getUsers({
      limit,
      offset,
      nombre,
      correo,
      rol,
    });
    const totalUsers = await UserRepository.getTotalUsers({
      nombre,
      correo,
      rol,
    });

    return {
      users,
      total: totalUsers,
      page,
      pages: Math.ceil(totalUsers / limit),
    };
  }
}
