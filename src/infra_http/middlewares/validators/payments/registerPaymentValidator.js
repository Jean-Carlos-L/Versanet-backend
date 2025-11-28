import { PaymentRepository } from "../../../../infrastructure/repositories/paymentRepository.js";
import { InvoiceRepository } from "../../../../infrastructure/repositories/invoiceRepository.js";

class Handler {
  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.invoiceRepository = new InvoiceRepository();
  }

  setNext(next) {
    this.next = next;
    return next;
  }
  async handle(reqBody) {
    if (this.next) return this.next.handle(reqBody);
    return { ok: true };
  }
}

class InvoicePaidHandler extends Handler {
  async handle(reqBody) {
    const { invoiceId } = reqBody;
    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (invoice.status === "pagada") {
      return {
        ok: false,
        status: 400,
        error: "Factura ya pagada no se puede editar.",
      };
    }
    return super.handle(reqBody);
  }
}

class PaymentAmountValidHandler extends Handler {
  async handle(reqBody) {
    const { amount } = reqBody;
    const totalAmountPaid = await this.paymentRepository.sumTotalAmountByInvoice(
      reqBody.invoiceId, { status: "completado" }
    );
    const invoice = await this.invoiceRepository.findById(reqBody.invoiceId);

    const totalPaid = invoice.amount;
    const newTotalPaid = totalAmountPaid + amount;

    if (newTotalPaid > totalPaid) {
      return {
        ok: false,
        status: 400,
        error: "El monto del pago excede el total de la factura.",
      };
    }
    return super.handle(reqBody);
  }
}

class PaymentDateValidHandler extends Handler {
  async handle(reqBody) {
    const { paymentDate } = reqBody;
    const now = new Date();
    const paymentDateObj = new Date(paymentDate);
    if (paymentDateObj > now) {
      return {
        ok: false,
        status: 400,
        error: "La fecha de pago no puede ser en el futuro.",
      };
    }
    return super.handle(reqBody);
  }
}

export function buildRegisterValidatorChain() {
  const invoicePaidHandler = new InvoicePaidHandler();
  const paymentAmountValidHandler = new PaymentAmountValidHandler();
  const paymentDateValidHandler = new PaymentDateValidHandler();

  invoicePaidHandler.setNext(paymentAmountValidHandler);
  invoicePaidHandler.setNext(paymentAmountValidHandler);
  paymentAmountValidHandler.setNext(paymentDateValidHandler);

  return invoicePaidHandler;
}
