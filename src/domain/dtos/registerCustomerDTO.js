// src/domain/dtos/registerCustomerDTO.js
export class RegisterCustomerDTO {
  constructor({ name, email, phone, document, address }) {
    if (!name || !email || !phone || !document || !address) {
      throw new Error("Faltan datos requeridos para registrar el cliente.");
    }

    this.name = name.trim();
    this.email = email.toLowerCase().trim();
    this.phone = phone.trim();
    this.document = document.trim();
    this.address = address.trim();
  }
}
