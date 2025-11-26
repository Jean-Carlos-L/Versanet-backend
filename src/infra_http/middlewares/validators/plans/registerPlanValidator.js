import { PlanRepository } from "../../../../infrastructure/repositories/planRepository.js";

class Handler {
  constructor() {
    this.planRepository = new PlanRepository();
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
    const { description, features, price, duration } = body;
    if (!description || !features || !price || !duration)
      return {
        ok: false,
        error: "description, features, price and duration are required",
      };
    return super.handle(body);
  }
}

class ValidPriceHandler extends Handler {
  async handle(body) {
    const price = parseFloat(body.price);
    if (isNaN(price) || price <= 0)
      return { ok: false, error: "price must be a positive number" };
    return super.handle(body);
  }
}

class ValidDurationHandler extends Handler {
  async handle(body) {
    const duration = parseInt(body.duration, 10);
    if (isNaN(duration) || duration <= 0)
      return { ok: false, error: "duration must be a positive integer" };
    return super.handle(body);
  }
}

class UniqueDescriptionHandler extends Handler {
  async handle(body) {
    const existingPlan = await this.planRepository.findByDescription(body.description);
    if (existingPlan) 
      return { ok: false, error: "description already registered" };
    return super.handle(body);
  }
}

function buildRegisterValidatorChain() {
  const requiredFields = new RequiredFieldsHandler();
  const validPrice = new ValidPriceHandler();
  const validDuration = new ValidDurationHandler();
  const uniqueDescription = new UniqueDescriptionHandler();

  requiredFields.setNext(validPrice).setNext(validDuration).setNext(uniqueDescription);
  return requiredFields;
}

export { buildRegisterValidatorChain };