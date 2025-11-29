import { UserRepository } from "../../../infrastructure/repositories/userRepository.js";
import { ContractRepository } from "../../../infrastructure/repositories/contractRepository.js";
import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";
import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";

const userRepository = new UserRepository();
const contractRepository = new ContractRepository();
const customerRepository = new CustomerRepository();
const invoiceRepository = new InvoiceRepository();

export async function getCountEntities() {
  try {
    const userCount = await userRepository.count();
    const contractCount = await contractRepository.count();
    const customerCount = await customerRepository.count();
    const invoiceCount = await invoiceRepository.count();

    return {
      data: {
        users: userCount,
        contracts: contractCount,
        customers: customerCount,
        invoices: invoiceCount,
      },
    };
  } catch (error) {
    throw new Error("Error getting count of entities: " + error.message);
  }
}
