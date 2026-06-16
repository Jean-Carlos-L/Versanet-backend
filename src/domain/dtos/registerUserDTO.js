// src/domain/dtos/registerUserDTO.js
export class RegisterUserDTO {
  constructor({ name, email, password, role, passwordHash }) {
    if (!name || !email || !password || !role) {
      throw new Error("Faltan datos requeridos para registrar el usuario.");
    }

    this.name = name.trim();
    this.email = email.toLowerCase().trim();
    this.password = password;
    this.role = role;
    this.passwordHash = passwordHash;
  }
}
