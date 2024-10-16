import express from "express";

import {
  getPlansCustomers,
  disablePlan,
  enablePlan,
} from "../controllers/planCustomer.controller.js";

const router = express.Router();

router.get("/", getPlansCustomers);

router.put("/enable/:id", enablePlan);

router.put("/disable/:id", disablePlan);

export default router;
