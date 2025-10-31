import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";

const customerRepository = new CustomerRepository();

async function listCustomers({ filters }) {
  const { page = 1, limit = 10, ...rest } = filters;
  const offset = (Number(page) - 1) * Number(limit);
  const customerFilters = handleFilters(rest);
  const customers = await customerRepository.findAll({
    offset,
    limit: Number(limit),
    filters: { ...customerFilters },
  });
  const totalCustomers = await customerRepository.count({
    filters: { ...customerFilters },
  });
  return {
    data: customers,
    metadata: {
      total: totalCustomers,
      pages: Math.ceil(totalCustomers / limit),
      currentPage: Number(page),
    },
  };
}

const handleFilters = (query) => {
  const filters = {};
  if (query.name) {
    filters.nombres = query.name;
  }
  if (query.documentId) {
    filters.cedula = query.document;
  }
  if (query.email) {
    filters.correo_electronico = query.email;
  }
  if (query.status) {
    filters.estado = query.status;
  }
  return filters;
};

export { listCustomers };
