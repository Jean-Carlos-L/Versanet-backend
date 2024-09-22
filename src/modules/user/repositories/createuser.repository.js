import db from "../../common/config/mysql.connection.js"; // conexión a la BD

export class UserRepository {
  // Función para crear un usuario
  static async createUser({
    id,
    nombres,
    correo_electronico,
    contrasena,
    idRol,
    estado,
  }) {
    const query = `
      INSERT INTO usuarios (id, nombres, correo_electronico, contrasena, idRol, estado)
      VALUES (UUID(), ?, ?, ?, ?, ?)
    `;
    const result = await db.execute(query, [
      id,
      nombres,
      correo_electronico,
      contrasena,
      idRol,
      estado,
    ]);
    return result;
  }
}
