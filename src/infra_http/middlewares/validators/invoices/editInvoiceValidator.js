import { CustomerRepository } from "../../../../infrastructure/repositories/customerRepository.js";
import { InvoiceRepository } from "../../../../infrastructure/repositories/invoiceRepository.js";

class Handler {
  constructor() {
    this.customerRepository = new CustomerRepository();
    this.invoiceRepository = new InvoiceRepository();
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
    const { customerId, contractId, amount } = body;
    if (!customerId || !contractId || !amount)
      return {
        ok: false,
        error: "customerId, contractId and amount are required",
      };
    return super.handle(body);
  }
}

class InvoiceExistsHandler extends Handler {
  async handle(body) {
    if (!body.id) {
      return { ok: false, error: "Invoice ID is required for editing" };
    }
    try {
      const invoice = await this.invoiceRepository.findById(body.id);
      if (!invoice) {
        return { ok: false, error: "Invoice not found" };
      }
    } catch (error) {
      return { ok: false, error: "Invoice not found" };
    }
    return super.handle(body);
  }
}

class ValidCustomerHandler extends Handler {
  async handle(body) {
    try {
      const customer = await this.customerRepository.findById(body.customerId);
      if (!customer) {
        return { ok: false, error: "Customer not found" };
      }
    } catch (error) {
      return { ok: false, error: "Customer not found" };
    }
    return super.handle(body);
  }
}

class ValidContractHandler extends Handler {
  async handle(body) {
    // TODO: Implementar validación de contrato cuando el repositorio esté disponible
    // Por ahora, solo validamos que el contractId sea una cadena válida
    if (
      !body.contractId ||
      typeof body.contractId !== "string" ||
      body.contractId.trim() === ""
    ) {
      return { ok: false, error: "Invalid contract ID" };
    }
    return super.handle(body);
  }
}

class ValidAmountHandler extends Handler {
  async handle(body) {
    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount < 0) {
      return { ok: false, error: "Amount must be a positive number" };
    }
    return super.handle(body);
  }
}

class ValidInvoiceDateHandler extends Handler {
  async handle(body) {
    if (body.invoiceDate) {
      // Validate format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(body.invoiceDate)) {
        return {
          ok: false,
          error: "Invoice date must be in YYYY-MM-DD format",
        };
      }
    }
    return super.handle(body);
  }
}

class ValidStatusHandler extends Handler {
  async handle(body) {
    if (body.status) {
      if (!["pendiente", "pagada", "cancelada"].includes(body.status)) {
        return {
          ok: false,
          error: "Status must be 'pendiente', 'pagada', or 'cancelada'",
        };
      }
    }
    return super.handle(body);
  }
}

function buildEditValidatorChain() {
  const requiredFields = new RequiredFieldsHandler();
  const invoiceExists = new InvoiceExistsHandler();
  const validCustomer = new ValidCustomerHandler();
  const validContract = new ValidContractHandler();
  const validAmount = new ValidAmountHandler();
  const validInvoiceDate = new ValidInvoiceDateHandler();
  const validStatus = new ValidStatusHandler();

  requiredFields
    .setNext(invoiceExists)
    .setNext(validCustomer)
    .setNext(validContract)
    .setNext(validAmount)
    .setNext(validInvoiceDate)
    .setNext(validStatus);
  return requiredFields;
}

export { buildEditValidatorChain };
