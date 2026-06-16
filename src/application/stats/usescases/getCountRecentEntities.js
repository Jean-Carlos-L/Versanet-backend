import { ContractRepository } from "../../../infrastructure/repositories/contractRepository.js";
import { CustomerRepository } from "../../../infrastructure/repositories/customerRepository.js";
import { InvoiceRepository } from "../../../infrastructure/repositories/invoiceRepository.js";
import { DateUtils } from "../../../infrastructure/dates/dateUtils.js";
import { Op } from "sequelize";

const contractRepository = new ContractRepository();
const customerRepository = new CustomerRepository();
const invoiceRepository = new InvoiceRepository();

export async function getCountRecentEntities() {
  try {
    const contractCount = await contractRepository.count({
      filters: {
        createdAt: { [Op.gte]: DateUtils.getStartOfMonth() },
      },
    });
    const customerCount = await customerRepository.count({
      filters: {
        createdAt: { [Op.gte]: DateUtils.getStartOfMonth() },
      },
    });
    const invoiceCount = await invoiceRepository.count({
      filters: {
        createdAt: {
          [Op.gte]: DateUtils.getStartOfMonth(),
        },
        status: "pagada",
      },
    });

    // Calcular porcentajes vs mes anterior
    const startLastMonth = DateUtils.getStartOfMonth(DateUtils.getMonthsAgo(1));
    const endLastMonth = DateUtils.subtractTime(DateUtils.getStartOfMonth(), 1);

    const lastMonthContractCount = await contractRepository.count({
      filters: {
        createdAt: {
          [Op.between]: [startLastMonth, endLastMonth],
        },
      },
    });
    const lastMonthCustomerCount = await customerRepository.count({
      filters: {
        createdAt: {
          [Op.between]: [startLastMonth, endLastMonth],
        },
      },
    });
    const lastMonthInvoiceCount = await invoiceRepository.count({
      filters: {
        createdAt: {
          [Op.between]: [startLastMonth, endLastMonth],
        },
        status: "pagada",
      },
    });

    return {
      data: {
        contracts: {
          thisMonth: contractCount,
          percentageChange: calculatePercentageChange(
            contractCount,
            lastMonthContractCount
          ),
        },
        customers: {
          thisMonth: customerCount,
          percentageChange: calculatePercentageChange(
            customerCount,
            lastMonthCustomerCount
          ),
        },
        invoices: {
          thisMonth: invoiceCount,
          percentageChange: calculatePercentageChange(
            invoiceCount,
            lastMonthInvoiceCount
          ),
        },
      },
    };
  } catch (error) {
    throw new Error("Error getting count of recent entities: " + error.message);
  }
}

const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  const percentageChange = ((current - previous) / previous) * 100;
  if (percentageChange > 0) return "+" + percentageChange.toFixed(2);
  return percentageChange.toFixed(2);
};
