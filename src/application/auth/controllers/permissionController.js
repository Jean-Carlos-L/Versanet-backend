import express from "express";
import { listPermissions } from "../usecases/listPermissions.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const permissions = await listPermissions();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch permissions" });
  }
});

export default router;