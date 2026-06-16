// Domain entity (simple)
class Role {
  constructor({ id, description, status, permissions }) {
    this.id = id;
    this.description = description;
    this.status = status;
    this.permissions = permissions || [];
  }

  // métodos del dominio pueden ir aquí
  hasPermission(permission) {
    return this.permissions.includes(permission);
  }
}

export default Role;
