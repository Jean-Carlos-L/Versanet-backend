// Domain entity (simple)
class User {
  constructor({ id, name, email, passwordHash, role }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role || 'user';
  }

  // métodos del dominio pueden ir aquí
  isAdmin() {
    return this.role === 'admin';
  }
}

export default User;
