import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";

const invoiceRepository = new InvoiceRepository();

async function getInvoicesByContract(contractId) {
  const invoices = await invoiceRepository.findByContractId(contractId);
  return invoices;
}

export { getInvoicesByContract };
