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
        const { cliente_id, plan_id, fecha_inicio, fecha_fin, estado } = body;
        if (!cliente_id || !plan_id || !fecha_inicio || !fecha_fin)
            return {
                ok: false,
                error: "cliente_id, plan_id, fecha_inicio y fecha_fin son requeridos",
            };
        return super.handle(body);
    }
}

function buildRegisterContractValidatorChain() {
    const requiredFieldsHandler = new RequiredFieldsHandler();
    return requiredFieldsHandler;
}

export { buildRegisterContractValidatorChain };