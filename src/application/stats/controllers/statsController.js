import express from "express";
import {
  getCountEntities,
  getCountRecentEntities,
  getPercentageDistributionPlans,
} from "../usescases/index.js";

const router = express.Router();

router.get("/count-entities", async (req, res) => {
  try {
    const counts = await getCountEntities();
    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/count-recent-entities", async (req, res) => {
  try {
    const counts = await getCountRecentEntities();
    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/percentage-distribution-plans", async (req, res) => {
  try {
    const distribution = await getPercentageDistributionPlans();
    res.status(200).json(distribution);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
