import { PlanService } from "../services/plan.service.js";

export const getPlans = async (req, res) => {
  try {
    const plans = await PlanService.findAll();
    res.status(200).json({
      message: "Planes encontrados con éxito",
      data: plans,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanById = async (req, res) => {
  const { id } = req.params;
  try {
    const plan = await PlanService.findById(id);
    res.status(200).json({
      message: "Plan encontrado con éxito",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
