import express from "express";

import {
  getPlansCustomers,
  disablePlan,
  enablePlan,
  getCountPlansCustomers,
} from "../controllers/planCustomer.controller.js";

const router = express.Router();

router.get("/", getPlansCustomers);

router.get("/count", getCountPlansCustomers);

router.put("/enable/:id", enablePlan);

router.put("/disable/:id", disablePlan);

export default router;
