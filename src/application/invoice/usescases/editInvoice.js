import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";
import { EditInvoiceDTO } from "../../../domain/dtos/editInvoiceDTO.js";
import { InvoiceModel } from "../../../infrastructure/models/invoiceModel.js";

const invoiceRepository = new InvoiceRepository();

async function editInvoice(invoiceId, userInput, actor = null) {
  const invoiceDTO = new EditInvoiceDTO(userInput);

  let existingInvoice = await invoiceRepository.findById(invoiceId);
  if (!existingInvoice) {
    const error = new Error("La factura no existe.");
    error.status = 404;
    throw error;
  }

  if (InvoiceModel && InvoiceModel.sequelize) {
    const t = await InvoiceModel.sequelize.transaction();
    try {
      const result = await invoiceRepository.update(invoiceId, invoiceDTO, actor, { transaction: t });
      await t.commit();
      return result;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  const result = await invoiceRepository.update(invoiceId, invoiceDTO, actor);
  return result;
}

export { editInvoice };