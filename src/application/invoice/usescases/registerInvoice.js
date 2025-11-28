import { RegisterInvoiceDTO } from "../../../domain/dtos/registerInvoiceDTO.js";
import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";
import { ContractRepository } from "../../../infrastructure/repositories/contractRepository.js";
import { NotificationBuilder } from "../../../infrastructure/email/notificationBuilder.js";
import { EmailStrategy } from "../../../infrastructure/email/notificationStrategies.js";
import { createInvoiceNotification } from "./utils/email-templates/createInvoiceNotification.js";
import { generatePdfBuffer } from "./utils/generatePdf.js";

const invoiceRepository = new InvoiceRepository();
const contractRepository = new ContractRepository();

async function registerInvoice(userInput) {
  const invoiceDTO = new RegisterInvoiceDTO(userInput);

  const result = await invoiceRepository.create(invoiceDTO);

  const invoice = await invoiceRepository.findById(result.id);
  const contract = await contractRepository.findById(invoice.contractId);

  const emailHtml = createInvoiceNotification({ invoice });
  const pdfBuffer = await generatePdfBuffer({
    invoice,
    customer: invoice.customer,
    contract,
  });

  const email = new NotificationBuilder()
    .to(invoice.customer.email)
    .subject("Factura generada")
    .html(emailHtml)
    .attachments([
      {
        filename: `Factura_${invoice.id}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ])
    .build();
  await new EmailStrategy().send(email);
  return result;
}

export { registerInvoice };
