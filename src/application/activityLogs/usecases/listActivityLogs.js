import ActivityLogRepository from "../../../infrastructure/repositories/activityLogRepository.js";

const MAX_LIMIT = 200;

async function listActivityLogs({ page = 1, limit = 20, filters = {}, sort = "createdAt:desc" } = {}) {
  // sanitize inputs
  page = Number(page) || 1;
  limit = Math.min(Number(limit) || 20, MAX_LIMIT);
  if (limit <= 0) limit = 20;

  const offset = (page - 1) * limit;
  const [sortField, sortDir] = (sort || "createdAt:desc").split(":");
  const order = [[sortField || "createdAt", (sortDir || "desc").toUpperCase()]];

  const result = await ActivityLogRepository.findAll({ filters, offset, limit, order });

  const hasMore = page * limit < result.count;

  return {
    data: result.rows,
    total: result.count,
    page,
    limit,
    hasMore,
  };
}

export { listActivityLogs };
