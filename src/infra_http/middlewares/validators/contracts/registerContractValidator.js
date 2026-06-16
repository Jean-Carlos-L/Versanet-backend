import { ContractRepository } from "../../../../infrastructure/repositories/contractRepository.js";

class Handler {
  constructor() {
    this.contractRepository = new ContractRepository();
  }

  setNext(next) {
    this.next = next;
    return next;
  }

  async handle(reqBody) {
    if (this.next) return this.next.handle(reqBody);
    return { ok: true };
  }
}

class RequiredFieldsHandler extends Handler {
  async handle(body) {
    const { customer_id, plan_id, start_date, end_date } = body;
    if (!customer_id || !plan_id || !start_date || !end_date)
      return {
        ok: false,
        error:
          "Los campos de cliente, plan, fecha de inicio y fecha de fin son obligatorios.",
      };
    return super.handle(body);
  }
}

function buildRegisterContractValidatorChain() {
  const requiredFieldsHandler = new RequiredFieldsHandler();
  return requiredFieldsHandler;
}

export { buildRegisterContractValidatorChain };
