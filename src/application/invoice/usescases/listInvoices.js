import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";

const invoiceRepository = new InvoiceRepository();

async function listInvoices({ filters }) {
  const { page = 1, limit = 10, ...rest } = filters;
  const offset = (Number(page) - 1) * Number(limit);
  const invoiceFilters = handleFilters(rest);

  const invoices = await invoiceRepository.findAll({
    offset,
    limit: Number(limit),
    filters: { ...invoiceFilters },
  });

  const totalInvoices = await invoiceRepository.count({
    filters: { ...invoiceFilters },
  });

  return {
    data: invoices,
    metadata: {
      total: totalInvoices,
      pages: Math.ceil(totalInvoices / limit),
      currentPage: Number(page),
    },
  };
}

const handleFilters = (query) => {
  const filters = {};

  // Direct invoice filters
  if (query.customerId) {
    filters.cliente_id = query.customerId;
  }
  if (query.status) {
    filters.estado = query.status;
  }
  if (query.minAmount) {
    filters.minAmount = query.minAmount;
  }
  if (query.maxAmount) {
    filters.maxAmount = query.maxAmount;
  }
  if (query.invoiceDate) {
    filters.fecha_facturacion = query.invoiceDate;
  }

  // Customer filters (nombres, cedula)
  if (query.customer) {
    filters.cliente = query.customer;
  }

  // Contract filters (id) - this will override the direct contractId filter
  if (query.contract) {
    filters.contrato = {
      id: query.contract,
    };
  }

  return filters;
};

export { listInvoices };
