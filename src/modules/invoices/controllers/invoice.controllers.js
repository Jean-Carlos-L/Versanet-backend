import { InvoiceService } from "../services/invoice.service.js";

export const createInvoice = async (req, res) => {
  try {
    const invoice = await InvoiceService.createInvoice(req.params.id);
    res.status(201).json({
      message: "Factura creada con éxito",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
