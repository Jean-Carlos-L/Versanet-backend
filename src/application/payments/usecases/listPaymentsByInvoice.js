import { PaymentRepository } from "../../../infrastructure/repositories/paymentRepository.js";

const paymentRepository = new PaymentRepository();

async function listPaymentsByInvoice(invoiceId) {
  const payments = await paymentRepository.findByInvoiceId(invoiceId);
  return {data: payments};
}

export { listPaymentsByInvoice };