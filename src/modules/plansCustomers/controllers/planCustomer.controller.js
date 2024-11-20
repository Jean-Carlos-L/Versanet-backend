import { PlanCustomerService } from "../services/planCustomer.service.js";

export const getPlansCustomers = async (req, res) => {
  try {
    const plansCustomers = await PlanCustomerService.findAll(req.query);
    res.status(200).json({
      data: plansCustomers,
      message: "Plans customers listed",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCountPlansCustomers = async (req, res) => {
  try {
    const total = await PlanCustomerService.countPlansCustomers(req.query);
    res.status(200).json({
      data: total,
      message: "Total plans customers",
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

export const createPlanCustomer = async (req, res) => {
  try {
    await PlanCustomerService.create(req.body);
    res.status(200).json({
      message: "Plan customer created",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlanCustomer = async (req, res) => {
  try {
    await PlanCustomerService.update(req.params.id, req.body);
  
    res.status(200).json({
      message: "Plan customer updated",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanCustomerById = async (req, res) => {
  try {
    const planCustomer = await PlanCustomerService.findById(req.params.id);
    res.status(200).json({
      data: planCustomer,
      message: "Plan customer found",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlanCustomer = async (req, res) => {
  try {
    await PlanCustomerService.delete(req.params.id);
    res.status(200).json({
      message: "Plan customer deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


