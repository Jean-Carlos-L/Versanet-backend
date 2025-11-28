export class EditInvoiceDTO {
  constructor({ customerId, contractId, invoiceDate, amount, status }) {
    if (!customerId || !contractId || !amount) {
      throw new Error("Faltan datos requeridos para editar la factura.");
    }

    this.customerId = customerId.trim();
    this.contractId = contractId.trim();
    this.invoiceDate = invoiceDate ? invoiceDate.trim() : null;
    this.amount = parseFloat(amount);
    if (isNaN(this.amount) || this.amount < 0) {
      throw new Error("amount debe ser un número válido mayor o igual a 0.");
    }
    this.status = status ? status : "pendiente"; // default pendiente
  }
}
