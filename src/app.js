import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { MikrotikService } from "./modules/mikrotik/services/mikrotik.service.js";
import listRoutes from "./modules/listuser/routes/user.routes.js";
import createRoutes from "./modules/createuser/routes/user.routes.js";

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

app.use("/api", listRoutes); // Rutas de usuarios
app.use("/api", createRoutes); // Rutas de creación de usuarios

export default app;
