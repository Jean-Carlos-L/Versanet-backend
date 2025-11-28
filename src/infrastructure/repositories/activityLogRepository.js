import { ActivityLogModel } from "../models/activityLogModel.js";

export class ActivityLogRepository {
  async create(log, options = {}) {
    try {
      if (!log) return null;

      const createOpts = {};
      if (options.transaction) createOpts.transaction = options.transaction;

      const rec = await ActivityLogModel.create(
        {
          actor_id: log.actor_id || null,
          actor_name: log.actor_name || null,
          action: log.action,
          entity: log.entity,
          entity_id: log.entity_id || null,
          details: log.details || null,
          metadata: log.metadata || null,
        },
        createOpts
      );

      return rec.toJSON ? rec.toJSON() : rec;
    } catch (error) {
      console.error("ActivityLogRepository.create - error:", error && error.message ? error.message : error);
      throw error;
    }
  }

  async findAll({ filters = {}, offset = 0, limit = 20, order = [["createdAt", "DESC"]] } = {}) {
    try {
      const { Op } = ActivityLogModel.sequelize;
      const where = {};

      if (filters.id) where.id = filters.id;
      if (filters.entity) where.entity = filters.entity;
      if (filters.actor_id) where.actor_id = filters.actor_id;
      if (filters.action) where.action = filters.action;
      if (filters.actor_name) where.actor_name = { [Op.like]: `%${filters.actor_name}%` };
      if (filters.q) {
        where.details = { [Op.like]: `%${filters.q}%` };
      }
      if (filters.from || filters.to) {
        where.createdAt = {};
        if (filters.from) where.createdAt[Op.gte] = new Date(filters.from);
        if (filters.to) where.createdAt[Op.lte] = new Date(filters.to);
      }

      const res = await ActivityLogModel.findAndCountAll({ where, offset, limit, order });
      const rows = res.rows.map((r) => (r.toJSON ? r.toJSON() : r));
      return { rows, count: res.count };
    } catch (error) {
      console.error("ActivityLogRepository.findAll - error:", error && error.message ? error.message : error);
      throw error;
    }
  }
}

export default new ActivityLogRepository();
