// src/domain/dtos/registerRoleDTO.js
export class RegisterRoleDTO {
  constructor({ description, permissions }) {
    if (!description || !permissions) {
      throw new Error("Faltan datos requeridos para registrar el rol.");
    }

    this.description = description.trim();
    this.permissions = permissions.map((perm) => perm.trim());
  }
}
