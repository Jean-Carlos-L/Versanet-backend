import express from "express";
import {
  listPlans,
  editPlan,
  registerPlan,
  deletePlan,
  getPlanById,
} from "../usecases/index.js";
import {
  buildEditValidatorChain,
  buildRegisterValidatorChain,
} from "../../../infra_http/middlewares/validators/plans/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const filters = req.query;

  try {
    const plans = await listPlans({ filters });
    res.status(200).json(plans);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await getPlanById(id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const userInput = req.body;
  const chain = buildRegisterValidatorChain();
  const validationResult = await chain.handle(userInput);
  if (!validationResult.ok)
    return res.status(400).json({ error: validationResult.error });

  try {
    const newPlan = await registerPlan(userInput);
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const userInput = req.body;
  const chain = buildEditValidatorChain();
  const validationResult = await chain.handle({ ...userInput, id });
  if (!validationResult.ok)
    return res.status(400).json({ error: validationResult.error });

  try {
    const updatedPlan = await editPlan(id, userInput);
    res.status(200).json(updatedPlan);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deletePlan(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

export default router;