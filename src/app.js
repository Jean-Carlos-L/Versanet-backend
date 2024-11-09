import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { MikrotikService } from "./modules/mikrotik/services/mikrotik.service.js";
import userRoutes from "./modules/user/routes/user.routes.js";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import RoleRoutes from "./modules/roles/routes/role.routes.js";
import permissionsRouter from "./modules/permissions/routes/permission.route.js";
import { authMiddleware } from "./common/core/auth.middleware.js";
import planRouter from "./modules/plans/routes/plan.route.js";
import planCustomerRouter from "./modules/plansCustomers/routes/planCustomer.route.js";
import customerRouter from "./modules/customers/routes/customer.routes.js";
import { authorize } from "./common/core/role.middleware.js";
import { statsRoutes } from "./modules/stats/routes/stats.route.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

// Nuevo endpoint para obtener la identidad del sistema
app.get("/system-identity", async (req, res) => {
  try {
    const identity = await MikrotikService.getSystemIdentity();

    // Devolver el valor al cliente
    res.json(identity);
  } catch (error) {
    console.error("Error in /system-identity endpoint: ", error);
    res.status(500).json({
      error: "Failed to retrieve system identity",
    });
  }
});

app.get("/interface-traffic", async (req, res) => {
  try {
    const traffic = await MikrotikService.getInterfaceTraffic();

    res.json(traffic);
  } catch (error) {
    console.error("Error in /interface-traffic endpoint: ", error);
    res.status(500).json({
      error: "Failed to retrieve interface traffic",
    });
  }
});

app.get("/traffic-by-ip", async (req, res) => {
  try {
    const traffic = await MikrotikService.getTrafficByIP();

    res.json(traffic);
  } catch (error) {
    console.error("Error in /traffic-by-ip endpoint: ", error);
    res.status(500).json({
      error: "Failed to retrieve traffic by IP",
    });
  }
});

app.use("/api", authRoutes);

//app.use(authMiddleware);
app.use("/api/users", userRoutes);
app.use("/api/roles", RoleRoutes);
app.use("/api/permissions" , permissionsRouter);
app.use("/api/plans", planRouter);
app.use("/api/plans-customers", planCustomerRouter);
app.use("/api/customers", customerRouter);
app.use("/api/stats", statsRoutes);

export default app;
