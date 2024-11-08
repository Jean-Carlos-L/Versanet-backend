import express from "express";

import { getPermissions } from "../controllers/permission.controller.js";
import { authMiddleware } from "../../../common/core/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getPermissions);

export default router;
