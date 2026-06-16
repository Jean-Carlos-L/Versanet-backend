// Domain entity (simple)
class Permission {
  constructor({ id, description, code }) {
    this.id = id;
    this.description = description;
    this.code = code;
  }

  // métodos del dominio pueden ir aquí
  hasCode(code) {
    return this.code === code;
  }
}

export default Permission;
