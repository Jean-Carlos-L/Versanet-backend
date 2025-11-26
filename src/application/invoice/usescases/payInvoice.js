import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";

const invoiceRepository = new InvoiceRepository();

async function payInvoice(invoiceId) {
  const existingInvoice = await invoiceRepository.findById(invoiceId);
  if (!existingInvoice) {
    const error = new Error("La factura no existe.");
    error.status = 404;
    throw error;
  }

  if (existingInvoice.status === "pagado" || existingInvoice.status === 1) {
    const error = new Error("La factura ya está pagada.");
    error.status = 400;
    throw error;
  }

  const result = await invoiceRepository.updateStatus(invoiceId, "pagado");
  return { message: "Factura marcada como pagada exitosamente.", invoice: result };
}

export { payInvoice };