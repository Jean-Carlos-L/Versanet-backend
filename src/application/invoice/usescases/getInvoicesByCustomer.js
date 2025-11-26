import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";

const invoiceRepository = new InvoiceRepository();

async function getInvoicesByCustomer(customerId) {
  const invoices = await invoiceRepository.findByCustomerId(customerId);
  return invoices;
}

export { getInvoicesByCustomer };
