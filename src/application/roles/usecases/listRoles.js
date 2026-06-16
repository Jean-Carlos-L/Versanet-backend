import { RoleRepository } from "../../../infrastructure/repositories/roleRepository.js";

const roleRepository = new RoleRepository();

async function listRoles({ filters }) {
  const { page = 1, limit = 10, ...rest } = filters;
  const offset = (Number(page) - 1) * Number(limit);

  const roleFilters = handleFilters(rest);
  const roles = await roleRepository.findAll({
    offset,
    limit: Number(limit),
    filters: { ...roleFilters },
  });
  const totalRoles = await roleRepository.count({
    filters: { ...roleFilters },
  });
  return {
    data: roles,
    metadata: {
      total: totalRoles,
      pages: Math.ceil(totalRoles / limit),
      currentPage: Number(page),
    },
  };
}

const handleFilters = (query) => {
  const filters = {};
  if (query.name) {
    filters.descripcion = query.name;
  }
  if (query.status) {
    filters.estado = query.status;
  }
  return filters;
};

export { listRoles };