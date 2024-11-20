import { ContractRepository } from "../../stats/repositories/contract.repository.js";
import { ClientRepository } from "../../stats/repositories/client.repository.js";
import { statsAdapterDTO } from "../adapters/stats.adapter.js";

export class StatsService {
  static async fetchStats() {
    try {
      const totalContracts = await ContractRepository.getTotalContracts();
      const activeContracts = await ContractRepository.getActiveContracts();
      const inactiveContracts = await ContractRepository.getInactiveContracts();
      const totalClients = await ClientRepository.getTotalClients();
      const clientsWith30MPlan = await ContractRepository.getClientsByPlanSpeed(
        30
      );
      const clientsWith60MPlan = await ContractRepository.getClientsByPlanSpeed(
        60
      );
      const clientsWith90MPlan = await ContractRepository.getClientsByPlanSpeed(
        90
      );

      const stats = {
        totalContracts,
        activeContracts,
        inactiveContracts,
        totalClients,
        clientsWith30MPlan,
        clientsWith60MPlan,
        clientsWith90MPlan,
      };

      return statsAdapterDTO(stats);
    } catch (error) {
      throw new Error("Error al obtener estadísticas: " + error.message);
    }
  }
}
