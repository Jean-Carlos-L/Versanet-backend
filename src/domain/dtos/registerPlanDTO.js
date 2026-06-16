export class RegisterPlanDTO {
  constructor({ description, features, price, duration }) {
    if (!description || !features || !price || !duration) {
      throw new Error("Faltan datos requeridos para registrar el plan.");
    }

    this.description = description.trim();
    this.features = features.trim();
    this.price = parseFloat(price);
    this.duration = parseInt(duration, 10);
  }
}