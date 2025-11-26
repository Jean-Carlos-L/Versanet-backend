import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";
import { EditInvoiceDTO } from "../../../domain/dtos/editInvoiceDTO.js";

const invoiceRepository = new InvoiceRepository();

async function editInvoice(invoiceId, userInput) {
  const invoiceDTO = new EditInvoiceDTO(userInput);

  let existingInvoice = await invoiceRepository.findById(invoiceId);
  if (!existingInvoice) {
    const error = new Error("La factura no existe.");
    error.status = 404;
    throw error;
  }

  const result = await invoiceRepository.update(invoiceId, invoiceDTO);
  return result;
}

export { editInvoice };