export class EditRoleDTO {
  constructor({ description, permissions }) {
    if (!description || !permissions) {
      throw new Error("Faltan datos requeridos para editar el rol.");
    }

    this.description = description.trim();
    this.permissions = permissions.map((perm) => perm.trim());
  }
}
