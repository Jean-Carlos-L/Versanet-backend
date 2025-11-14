import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// 🔹 Conexión a la base de datos (Singleton)
import { Database } from "./src/infrastructure/db/index.js";

// 🔹 Rutas principales
import authRoutes from "./src/application/auth/controllers/authController.js";
import userRoutes from "./src/application/users/controllers/userController.js";
import customerRoutes from "./src/application/customers/controllers/customerController.js";
import roleRoutes from "./src/application/roles/controllers/roleController.js";
import permissionRoutes from "./src/application/auth/controllers/permissionController.js";
import inventoryRoutes from "./src/application/inventory/controllers/inventoryController.js";
import contractRoutes from "./src/application/contract/controllers/contractController.js";

// 🔹 Middlewares globales
import { errorHandler } from "./src/infra_http/middlewares/errorHandler.js";
import { authMiddleware } from "./src/infra_http/middlewares/authMiddleware.js";


// import {
//   initializeDefaultPermissions,
//   initializeDefaultRolePermissions,
//   initializeDefaultRoles,
//   initializeDefaultUsers,
// } from "./src/infrastructure/db/initializeDefaultData.js";

const app = express();

// ===== Middlewares =====
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Forzar no-cache en las rutas /api para evitar respuestas 304 durante desarrollo
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// ===== Health Check Route =====
app.get("/health", async (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// ===== Public Routes=====
app.use("/api/auth", authRoutes);

// ===== Protected Routes =====
//app.use(authMiddleware);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/contracts", contractRoutes);

// ===== Error handling =====
app.use(errorHandler);

// ===== Server start =====
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await Database.getInstance().connect();

    // const sequelize = Database.getInstance().getConnection();

    //Initialize default data
    // await initializeDefaultPermissions(sequelize.models.Permission);
    // await initializeDefaultRoles(sequelize.models.Role);
    // await initializeDefaultRolePermissions(sequelize.models.RolePermission);
    // await initializeDefaultUsers(sequelize.models.User);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1);
  }
})();
