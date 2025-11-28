import ActivityLogRepository from "../repositories/activityLogRepository.js";

class AuditService {
  async record(log, options = {}) {
    return ActivityLogRepository.create(log, options);
  }
}

export default new AuditService();
