import { RegisterInvoiceDTO } from "../../../domain/dtos/registerInvoiceDTO.js";
import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";

const invoiceRepository = new InvoiceRepository();

async function registerInvoice(userInput) {
  const invoiceDTO = new RegisterInvoiceDTO(userInput);

  const result = await invoiceRepository.create(invoiceDTO);
  return result;
}

export { registerInvoice };