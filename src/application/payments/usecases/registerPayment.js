import { PaymentRepository } from "../../../infrastructure/repositories/paymentRepository.js";
import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";
import { RegisterPaymentDTO } from "../../../domain/dtos/paymentDTOs/registerPaymentoDTO.js";
import { EmailStrategy } from "../../../infrastructure/email/notificationStrategies.js";
import { NotificationBuilder } from "../../../infrastructure/email/notificationBuilder.js";
import { generatePaymentReceiptBuffer } from "./utils/generatePdf.js";
import { createPaymentNotificationSimpleHTML } from "./utils/email-templates/createPaymentNotification.js";

const paymentRepository = new PaymentRepository();
const customerRepository = new CustomerRepository();

async function registerPayment(userInput) {
  try {
    const paymentDTO = new RegisterPaymentDTO(userInput);

    const result = await paymentRepository.create(paymentDTO);
    const payment = await paymentRepository.findById(result.id);
    const customer = await customerRepository.findById(
      payment.invoice.customerId
    );

    const emailHtml = createPaymentNotificationSimpleHTML({ payment });
    const pdf = await generatePaymentReceiptBuffer({ payment });

    const email = new NotificationBuilder()
      .to(customer.email)
      .subject("Recibo de pago")
      .html(emailHtml)
      .attachments([
        {
          filename: `Comprobante_Pago_${payment.id}.pdf`,
          content: pdf,
          contentType: "application/pdf",
        },
      ])
      .build();
    new EmailStrategy().send(email);

    return { message: "Pago registrado correctamente", data: result };
  } catch (error) {
    console.error("Error registering payment:", error);
    throw new Error("Error registering payment");
  }
}

export { registerPayment };
