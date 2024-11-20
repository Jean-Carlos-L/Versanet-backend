import { StatsService } from "../services/stats.service.js";

export const getStats = async (req, res) => {
  try {
    const stats = await StatsService.fetchStats();
    return res
      .status(200)
      .json({ message: "Datos recopilados exitosamente", data: stats });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al recopilar datos", error: error.message });
  }
};
