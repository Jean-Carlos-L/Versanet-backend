import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mikrotikRoutes from "./modules/mikrotik/routes/mikrotik.routes.js";
import inventoryRoutes from "./modules/inventory/routes/inventory.routes.js";
import userRoutes from "./modules/user/routes/user.routes.js";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import RoleRoutes from "./modules/roles/routes/role.routes.js";
import permissionsRouter from "./modules/permissions/routes/permission.route.js";
import { authMiddleware } from "./common/core/auth.middleware.js";
import planRouter from "./modules/plans/routes/plan.route.js";
import planCustomerRouter from "./modules/plansCustomers/routes/planCustomer.route.js";
import customerRouter from "./modules/customers/routes/customer.routes.js";
import historyRouter from "./modules/history/routes/history.routes.js";
import { authorize } from "./common/core/role.middleware.js";
import { statsRoutes } from "./modules/stats/routes/stats.route.js";
import invoiceRouter from "./modules/invoices/routes/invoice.routes.js";
import paymentRouter from "./modules/payments/routes/payment.routes.js";

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

app.use("/api", authRoutes);

app.use(authMiddleware);
app.use("/api/users", userRoutes);
app.use("/api/roles", RoleRoutes);
app.use("/api/permissions", permissionsRouter);
app.use("/api/plans", planRouter);
app.use("/api/plans-customers", planCustomerRouter);
app.use("/api/customers", customerRouter);
app.use("/api/stats", statsRoutes);
app.use("/api/mikrotik", mikrotikRoutes);
app.use("/api/history", historyRouter);
app.use("/api/inventario", inventoryRoutes);
app.use("/api/invoices", invoiceRouter);
app.use("/api/payments", paymentRouter);

export default app;
