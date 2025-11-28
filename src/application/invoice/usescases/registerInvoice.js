import { RegisterInvoiceDTO } from "../../../domain/dtos/registerInvoiceDTO.js";
import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";
import { InvoiceModel } from "../../../infrastructure/models/invoiceModel.js";

const invoiceRepository = new InvoiceRepository();

async function registerInvoice(userInput, actor = null) {
  const invoiceDTO = new RegisterInvoiceDTO(userInput);

  if (InvoiceModel && InvoiceModel.sequelize) {
    const t = await InvoiceModel.sequelize.transaction();
    try {
      const result = await invoiceRepository.create(invoiceDTO, actor, { transaction: t });
      await t.commit();
      return result;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  const result = await invoiceRepository.create(invoiceDTO, actor);
  return result;
}

export { registerInvoice };