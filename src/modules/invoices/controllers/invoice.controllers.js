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

export const countInvoices = async (req, res) => {
  try {
    const totalInvoices = await InvoiceService.countInvoice(req.query);
    res.status(200).json({ data: totalInvoices, message: "Total invoices" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await InvoiceService.findAllInvoices(req.query);
    res.status(200).json({
      data: invoices,
      message: "Plans customers listed",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
