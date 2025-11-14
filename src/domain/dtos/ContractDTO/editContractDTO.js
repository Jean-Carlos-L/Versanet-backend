export class EditContractDTO {
  constructor(payload = {}) {
    // hazlo todo en inglés, nada en español
    const customer_id = payload.customer_id ?? null;
    const plan_id = payload.plan_id ?? payload.planId ?? null;
    const start_date = payload.start_date ?? null;
    const end_date = payload.end_date ?? null;
    const inventory_id = payload.inventory_id ?? null;
    const status = payload.status ?? null;

    const dto = {};

    if (customer_id != null) dto.customer_id = String(customer_id).trim();
    if (plan_id != null) dto.plan_id = String(plan_id).trim();
    if (Object.prototype.hasOwnProperty.call(payload, 'inventory_id')) dto.inventory_id = payload.equipment_id;
    if (Object.prototype.hasOwnProperty.call(payload, 'status')) dto.status = payload.status;

    if (start_date != null) {
      const s = new Date(start_date);
      if (Number.isNaN(s.getTime())) throw new Error('Invalid start_date');
      dto.start_date = s.toISOString();
    }
    if (end_date != null) {
      const e = new Date(end_date);
      if (Number.isNaN(e.getTime())) throw new Error('Invalid end_date');
      dto.end_date = e.toISOString();
    }

    if (dto.start_date && dto.end_date) {
      const s = new Date(dto.start_date);
      const e = new Date(dto.end_date);
      if (s >= e) throw new Error('start_date must be before end_date');
    }

    this.payload = dto;
  }
}

export default EditContractDTO;
