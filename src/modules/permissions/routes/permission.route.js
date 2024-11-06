import express from "express";

import { getPermissions } from "../controllers/permission.controller.js";
import { authorize } from "../../../common/core/role.middleware.js";

const router = express.Router();

router.get("/",  getPermissions);

export default router;
