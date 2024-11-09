import express from "express";
import { MikrotikController } from "../controllers/mikrotik.controller.js";

const router = express.Router();

router.get("/system-identity", MikrotikController.getSystemIdentity);
router.get("/interface-traffic", MikrotikController.getInterfaceTraffic);
router.get("/traffic-by-ip", MikrotikController.getTrafficByIP);

export default router;
