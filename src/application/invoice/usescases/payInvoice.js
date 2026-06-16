import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";
import { InvoiceModel } from "../../../infrastructure/models/invoiceModel.js";

const invoiceRepository = new InvoiceRepository();

async function payInvoice(invoiceId, actor = null) {
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

  if (InvoiceModel && InvoiceModel.sequelize) {
    const t = await InvoiceModel.sequelize.transaction();
    try {
      const result = await invoiceRepository.updateStatus(invoiceId, "pagado", actor, { transaction: t });
      await t.commit();
      return { message: "Factura marcada como pagada exitosamente.", invoice: result };
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  const result = await invoiceRepository.updateStatus(invoiceId, "pagado", actor);
  return { message: "Factura marcada como pagada exitosamente.", invoice: result };
}

export { payInvoice };