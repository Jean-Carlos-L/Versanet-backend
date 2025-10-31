import { UserRepository } from "../../../infrastructure/repositories/userRepository.js";

const userRepository = new UserRepository();

async function listUsers({ filters }) {
  const { page = 1, limit = 10, ...rest } = filters;
  const offset = (Number(page) - 1) * Number(limit);

  const userFilters = handleFilters(rest);

  const users = await userRepository.findAll({
    offset,
    limit: Number(limit),
    filters: { ...userFilters },
  });
  const totalUsers = await userRepository.count({
    filters: { ...userFilters },
  });
  return {
    data: users.map(
      ({ passwordHash, ...userWithoutPassword }) => userWithoutPassword
    ),
    metadata: {
      total: totalUsers,
      pages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
    },
  };
}

const handleFilters = (query) => {
  const filters = {};
  if (query.name) {
    filters.nombres = query.name;
  }
  if (query.email) {
    filters.correo_electronico = query.email;
  }
  return filters;
}

export { listUsers };
