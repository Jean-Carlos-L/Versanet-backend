import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";

const invoiceRepository = new InvoiceRepository();

async function deleteInvoice(invoiceId) {
  const existingInvoice = await invoiceRepository.findById(invoiceId);
  if (!existingInvoice) {
    const error = new Error("La factura no existe.");
    error.status = 404;
    throw error;
  }

  await invoiceRepository.delete(invoiceId);
  return { message: "Factura eliminada exitosamente." };
}

export { deleteInvoice };