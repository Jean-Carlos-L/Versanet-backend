import { PlanRepository } from "../../../infrastructure/repositories/planRepository.js";

const planRepository = new PlanRepository();

async function listPlans({ filters }) {
  const { page = 1, limit = 10, ...rest } = filters;
  const offset = (Number(page) - 1) * Number(limit);
  const planFilters = handleFilters(rest);
  
  const plans = await planRepository.findAll({
    offset,
    limit: Number(limit),
    filters: { ...planFilters },
  });
  
  const totalPlans = await planRepository.count({
    filters: { ...planFilters },
  });
  
  return {
    data: plans,
    metadata: {
      total: totalPlans,
      pages: Math.ceil(totalPlans / limit),
      currentPage: Number(page),
    },
  };
}

const handleFilters = (query) => {
  const filters = {};
  if (query.description) {
    filters.descripcion = query.description;
  }
  if (query.price) {
    filters.precio = query.price;
  }
  if (query.status) {
    filters.estado = query.status;
  }
  if (query.duration) {
    filters.duracion = query.duration;
  }
  return filters;
};

export { listPlans };