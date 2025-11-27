export class UpdateInventoryDTO {
  constructor({ reference, network_address, type, quantity, status }) {
    // Campos opcionales, pero valida los proporcionados
    if (reference !== undefined && !reference.trim()) {
      throw new Error("Referencia no puede estar vacía");
    }
    if (network_address !== undefined && !network_address.trim()) {
      throw new Error("Dirección de red no puede estar vacía");
    }
    if (type !== undefined) {
      const validTypes = ["router", "switch", "mac", "otros"];
      if (!validTypes.includes(type.trim())) {
        throw new Error(
          `Tipo de equipo inválido. Valores permitidos: ${validTypes.join(
            ", "
          )}`
        );
      }
    }
    if (isNaN(Number(quantity)) || Number(quantity) < 0) {
      throw new Error("Cantidad debe ser un número entero positivo");
    }
    if (quantity === 0) {
      status = "inactivo";
    }
    if (
      status !== undefined &&
      !["activo", "inactivo", "mantenimiento"].includes(status.trim())
    ) {
      throw new Error(
        "Estado inválido. Valores permitidos: activo, inactivo, mantenimiento"
      );
    }

    this.reference = reference ? reference.trim() : undefined;
    this.network_address = network_address ? network_address.trim() : undefined;
    this.type = type ? type.trim() : undefined;
    this.quantity = quantity;
    this.status = status ? status.trim() : undefined;
  }
}
