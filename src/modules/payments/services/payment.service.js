import { PaymentRepository } from "../repositories/payment.repository.js";
import {
  paymentAdapterEntity,
  paymentAdapterDTO,
} from "../adapters/payment.adapter.js";
import { CustomerRepository } from "../../customers/repositories/costumer.repository.js";
import { InvoiceRepository } from "../../invoices/repositories/invoice.repository.js";
import { generatePDFPayment } from "./generatePDF.service.js";
import { sendEmail } from "../../../common/utils/mailer.util.js";

export class PaymentService {
  static async createPayment(payment) {
    try {
      const customer = await CustomerRepository.findById(payment.customer_id);
      if (!customer) {
        throw new Error("Cliente no encontrado");
      }
      console.log("customer", customer);
      const invoice = await InvoiceRepository.findById(payment.invoice_id);
      if (!invoice) {
        throw new Error("Factura no encontrada");
      }
      console.log("invoice", invoice);
      if (invoice.estado === 0) {
        throw new Error("La factura ya se encuentra pagada");
      }
      if (invoice.idCliente !== customer.id) {
        throw new Error("La factura no pertenece al cliente");
      }
      if (invoice.monto_total !== payment.amountPaid) {
        throw new Error(
          "El monto pagado no coincide con el total de la factura"
        );
      }

      // actulizar el estado de la factura a pagada
      await InvoiceRepository.paid(payment.invoice_id);

      const paymentEntity = paymentAdapterEntity(payment);

      const row = await PaymentRepository.create(paymentEntity);

      console.log("payment", row);

      await this.sendPayment(invoice, customer);

      return {
        message: "Pago creado con éxito",
      };
    } catch (error) {
      throw new Error("Error al crear el pago: " + error.message);
    }
  }

  static async sendPayment(invoice, customer) {
    try {
      const subject = "Pago de factura";
      const message = "En el adjunto encontrarás el recibo de tu pago.";
      const namefile = `recibo-${customer.nombres}.pdf`;
      const pdfPath = await generatePDFPayment(invoice, customer);
      const email = customer.correo_electronico;
      await sendEmail(email, subject, message, namefile, pdfPath);

      return {
        message: "Pago enviado con éxito",
      };
    } catch (error) {
      throw new Error("Error al enviar el pago: " + error.message);
    }
  }
}
