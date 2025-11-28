import { ContractRepository } from "../../../infrastructure/repositories/contractRepository.js";
import { PlanRepository } from "../../../infrastructure/repositories/planRepository.js";

const contractRepository = new ContractRepository();
const planRepository = new PlanRepository();

export async function getPercentageDistributionPlans() {
  try {
    console.log("Obteniendo la distribución porcentual de planes...");
    // Obtener la distribución de planes desde los contratos activos
    const planDistribution = await contractRepository.getPlanDistribution();
    
    // Calcular el total de contratos para obtener los porcentajes
    const totalContracts = planDistribution.reduce((sum, item) => sum + item.count, 0);
    
    // Si no hay contratos, retornar array vacío
    if (totalContracts === 0) {
      return { data: [] };
    }
    
    // Calcular porcentajes para cada plan
    const data = planDistribution.map(item => ({
      plan: item.planName,
      count: item.count,
      percentage: Math.round((item.count / totalContracts) * 100 * 100) / 100 // Redondear a 2 decimales
    }));
    
    // Ordenar por porcentaje descendente
    data.sort((a, b) => b.percentage - a.percentage);

    console.log("Distribución porcentual de planes:", data);
    
    return { 
      data: data,
      total: totalContracts
    };
  } catch (error) {
    console.error("Error obteniendo la distribución porcentual de planes:", error);
    throw error;
  }
}