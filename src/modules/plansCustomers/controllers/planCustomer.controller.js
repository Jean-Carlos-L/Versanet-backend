import { PlanCustomerService } from "../services/planCustomer.service.js";

export const getPlansCustomers = async (req, res) => {
  try {
    const plansCustomers = await PlanCustomerService.findAll(req.query);
    res.status(200).json({
      data: plansCustomers,
      message: "Plans customers listed",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enablePlan = async (req, res) => {
  try {
    const rows = await PlanCustomerService.enablePlan(req.params.id);
    res.status(200).json({
      data: rows,
      message: "Plan enabled",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const disablePlan = async (req, res) => {
  try {
    const rows = await PlanCustomerService.disablePlan(req.params.id);
    res.status(200).json({
      data: rows,
      message: "Plan disabled",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
