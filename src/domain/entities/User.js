// Domain entity (simple)
class User {
  constructor({ id, name, email, passwordHash, role, recoveryCode = null }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.recoveryCode = recoveryCode;
    this.role = role || 'user';
  }

  // métodos del dominio pueden ir aquí
  isAdmin() {
    return this.role === 'admin';
  }

  isSameRecoverCode(code) {
    return this.recoveryCode === code;
  }
}

export default User;
