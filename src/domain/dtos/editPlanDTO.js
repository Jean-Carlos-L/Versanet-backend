export class EditPlanDTO {
  constructor({ description, features, price, duration, status }) {
    if (!description || !features || !price || !duration) {
      throw new Error("Faltan datos requeridos para editar el plan.");
    }

    this.description = description.trim();
    this.features = features.trim();
    this.price = parseFloat(price);
    this.duration = parseInt(duration, 10);
    this.status = status !== undefined ? status : 1; // Default to active
  }
}