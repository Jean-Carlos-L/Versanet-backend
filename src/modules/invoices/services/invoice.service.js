import { InvoiceRepository } from "../repositories/invoice.repository.js";
import { invoiceAdapterDTO } from "../adapters/invoice.adapter.js";
import { generatePDF } from "./pdfGenerator.util.js";
import { CustomerRepository } from "../../customers/repositories/costumer.repository.js";
import { PlanRepository } from "../../plans/repositories/plan.repository.js";
import { sendEmail } from "../../../common/utils/mailer.util.js";
import { PlanCustomerRepository } from "../../plansCustomers/repositories/planCustomer.repository.js";

export class InvoiceService {
  static async createInvoice(contractId) {
    try {
      const contract = await PlanCustomerRepository.findById(contractId);
      if (!contract) {
        throw new Error("Contrato no encontrado");
      }

      if (contract.estado === 0) {
        throw new Error("No se puede facturar un contrato deshabilitado");
      }

      const customer = await CustomerRepository.findById(contract.id);
      if (!customer) {
        throw new Error("Cliente no encontrado");
      }

      const totalAmount = parseFloat(contract.plan_precio);
      if (isNaN(totalAmount) || totalAmount <= 0) {
        throw new Error("El monto del plan es inválido.");
      }

      const invoice = await InvoiceRepository.create({
        id_cliente: customer.id,
        id_cliente_plan: contractId,
        fecha_facturacion: new Date(),
        monto_total: totalAmount,
      });

      await this.sendInvoice(invoice.id, contractId);

      return { message: "Factura creada con éxito" };
    } catch (error) {
      throw new Error("Error al crear la factura: " + error.message);
    }
  }

  static async sendInvoice(invoiceId, contractId) {
    try {
      const invoice = await InvoiceRepository.findById(invoiceId);
      if (!invoice) {
        throw new Error("Factura no encontrada");
      }

      const customer = await CustomerRepository.findById(invoice.idCliente);

      const subject = "Factura de pago";
      const message =
        "En el adjunto encontrarás la factura de tu plan contratado.";
      const namefile = `factura-${customer.nombres}.pdf`;
      const pdfPath = await generatePDF(invoiceId, contractId);

      await sendEmail(
        customer.correo_electronico,
        subject,
        message,
        namefile,
        pdfPath
      );
      return { message: "Factura enviada con éxito" };
    } catch (error) {
      throw new Error("Error al enviar la factura: " + error.message);
    }
  }

  static async updateInvoice(id, invoice) {
    try {
      const currentInvoice = await InvoiceRepository.findById(id);
      if (!currentInvoice) {
        throw new Error("Factura no encontrada");
      }

      await InvoiceRepository.update(id, invoice);
      return { message: "Factura actualizada con éxito" };
    } catch (error) {
      throw new Error("Error al actualizar la factura: " + error.message);
    }
  }

  static async payInvoice(id) {
    try {
      const invoice = await InvoiceRepository.findById(id);
      if (!invoice) {
        throw new Error("Factura no encontrada");
      }

      await InvoiceRepository.paid(id);
      return { message: "Factura pagada con éxito" };
    } catch (error) {
      throw new Error("Error al pagar la factura: " + error.message);
    }
  }

  static async findAllInvoices(filters) {
    try {
      const invoices = await InvoiceRepository.findAll(filters);
      return invoices.map(invoiceAdapterDTO);
    } catch (error) {
      throw new Error("Error al obtener las facturas: " + error.message);
    }
  }

  static async countInvoice(filters) {
    try {
      const count = await InvoiceRepository.countAll(filters);
      return count;
    } catch (error) {
      throw new Error("Error al contar las facturas: " + error.message);
    }
  }
}
