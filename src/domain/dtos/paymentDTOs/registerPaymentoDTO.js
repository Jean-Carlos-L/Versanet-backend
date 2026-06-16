export class RegisterPaymentDTO {
  constructor({ amount, paymentDate, method, status, invoiceId }) {
    if (
      !amount ||
      !paymentDate ||
      !method ||
      !status ||
      !invoiceId
    ) {
      throw new Error("Faltan datos requeridos para registrar el pago.");
    }

    if (isNaN(amount) || amount <= 0) {
      throw new Error("El monto del pago debe ser un número positivo.");
    }

    if (isNaN(Date.parse(paymentDate))) {
      throw new Error("La fecha de pago no es válida.");
    }

    const now = new Date();
    const date = new Date(this.paymentDate);
    if (date > now) {
      throw new Error("La fecha de pago no puede ser en el futuro.");
    }

    this.amount = amount;
    this.paymentDate = paymentDate;
    this.method = method;
    this.status = status;
    this.invoiceId = invoiceId;
  }
}
