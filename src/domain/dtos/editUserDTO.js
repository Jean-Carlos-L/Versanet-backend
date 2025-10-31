export class EditUserDTO {
  constructor({ name, email, password, role, passwordHash }) {
    if (!name || !email || !role) {
      throw new Error("Faltan datos requeridos para registrar el usuario.");
    }

    this.name = name.trim();
    this.email = email.toLowerCase().trim();
    this.password = password;
    this.role = role;
    this.passwordHash = passwordHash;
  }
}
