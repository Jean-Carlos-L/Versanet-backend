import { query } from "../../../common/utils/query.utils.js";

export class UserRepository {
  // Función para crear un usuario
  static async createUser(user) {
    const sql = `INSERT INTO usuarios (id, nombres, correo_electronico, contrasena, idRol, estado) 
                 VALUES (UUID(), ?, ?, ?, ?, 1)`;
    const params = [
      user.nombres,
      user.correo_electronico,
      user.contrasena,
      user.idRol,
      user.estado,
    ];
    await query(sql, params);
  }

  // Función para actualizar un usuario
  static async updateUser(id, user) {
    if (!user.contrasena) {
      const sql = `UPDATE usuarios SET nombres = ?, correo_electronico = ?, idRol = ? WHERE id = ?`;
      const params = [user.nombres, user.correo_electronico, user.idRol, id];
      await query(sql, params);
      return;
    }
    const sql = `UPDATE usuarios SET nombres = ?, correo_electronico = ?, contrasena = ?, idRol = ? WHERE id = ?`;
    const params = [
      user.nombres,
      user.correo_electronico,
      user.contrasena,
      user.idRol,
      id,
    ];
    await query(sql, params);
  }

  // Función para buscar un usuario por su id
  static async findById(id) {
    const sql = `SELECT * FROM usuarios WHERE id = ? AND estado = 1`;
    return await query(sql, [id]);
  }

  // Función para buscar un usuario por su correo electrónico
  static async findByEmail(email) {
    const sql = `SELECT * FROM usuarios WHERE correo_electronico = ? AND estado = 1`;
    return await query(sql, [email]);
  }

  // Función para buscar todos los usuarios
  static async findAll() {
    const sql = `SELECT * FROM usuarios WHERE estado = 1`;
    return await query(sql);
  }

  // Función para eliminar un usuario
  static async deleteUser(id) {
    const sql = `UPDATE usuarios SET estado = 0 WHERE id = ?`;
    await query(sql, [id]);
  }
}
