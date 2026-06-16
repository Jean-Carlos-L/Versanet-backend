import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";
import { InvoiceModel } from "../../../infrastructure/models/invoiceModel.js";

const invoiceRepository = new InvoiceRepository();

async function deleteInvoice(invoiceId, actor = null) {
  const existingInvoice = await invoiceRepository.findById(invoiceId);
  if (!existingInvoice) {
    const error = new Error("La factura no existe.");
    error.status = 404;
    throw error;
  }

  if (InvoiceModel && InvoiceModel.sequelize) {
    const t = await InvoiceModel.sequelize.transaction();
    try {
      await invoiceRepository.delete(invoiceId, actor, { transaction: t });
      await t.commit();
      return { message: "Factura eliminada exitosamente." };
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  await invoiceRepository.delete(invoiceId, actor);
  return { message: "Factura eliminada exitosamente." };
}

export { deleteInvoice };