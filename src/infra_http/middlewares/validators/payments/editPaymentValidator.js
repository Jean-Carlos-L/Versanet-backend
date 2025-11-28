import { PaymentRepository } from "../../../../infrastructure/repositories/paymentRepository.js";

class Handler {
  constructor() {
    this.paymentRepository = new PaymentRepository();
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

class PaymentExistsHandler extends Handler {
  async handle(reqBody) {
    const { id } = reqBody;
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      return {
        ok: false,
        status: 404,
        error: "Payment not found",
      };
    }
    return super.handle(reqBody);
  }
}

class PaymentNotCancelledHandler extends Handler {
  async handle(reqBody) {
    const { id } = reqBody;
    const payment = await this.paymentRepository.findById(id);
    if (payment.status === "cancelado") {
      return {
        ok: false,
        status: 400,
        error: "Pago cancelado no se puede editar.",
      };
    }
    return super.handle(reqBody);
  }
}

class InvoicePaidHandler extends Handler {
  async handle(reqBody) {
    const { id } = reqBody;
    const payment = await this.paymentRepository.findById(id);
    if (payment.invoice.status === "pagada") {
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
    const { id, amount } = reqBody;
    const payment = await this.paymentRepository.findById(id);
    const totalAmountPaid =
      await this.paymentRepository.sumTotalAmountByInvoice(payment.invoiceId, {
        status: "completado",
      });
    const invoice = payment.invoice;

    const totalPaid = invoice.totalAmount;
    const newTotalPaid = totalAmountPaid - payment.amount + amount;

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

export function buildEditPaymentValidatorChain() {
  const paymentExistsHandler = new PaymentExistsHandler();
  const paymentNotCancelledHandler = new PaymentNotCancelledHandler();
  const invoicePaidHandler = new InvoicePaidHandler();
  const paymentAmountValidHandler = new PaymentAmountValidHandler();
  const paymentDateValidHandler = new PaymentDateValidHandler();

  paymentExistsHandler.setNext(paymentNotCancelledHandler);
  paymentNotCancelledHandler.setNext(invoicePaidHandler);
  invoicePaidHandler.setNext(paymentAmountValidHandler);
  paymentAmountValidHandler.setNext(paymentDateValidHandler);

  return paymentExistsHandler;
}
