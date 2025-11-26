import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";

const invoiceRepository = new InvoiceRepository();

async function getInvoiceById(invoiceId) {
  const invoice = await invoiceRepository.findById(invoiceId);
  return invoice;
}

export { getInvoiceById };
