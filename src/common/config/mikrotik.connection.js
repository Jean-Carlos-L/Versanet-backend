import { RouterOSAPI } from "node-routeros";
import {
  MIKROTIK_HOST,
  MIKROTIK_PASSWORD,
  MIKROTIK_PORT,
  MIKROTIK_USER,
} from "../constants/constants.js";

// Establecer la conexión a Mikrotik
export const connection = () =>
  new Promise((resolve, reject) => {
    const conn = new RouterOSAPI({
      host: MIKROTIK_HOST,
      port: MIKROTIK_PORT,
      user: MIKROTIK_USER,
      password: MIKROTIK_PASSWORD,
      timeout: 30000,
    });
    conn
      .connect()
      .then(() => {
        console.log("Conexión exitosa a Mikrotik");
        resolve(conn);
      })
      .catch((err) => {
        console.error("Error de conexión a Mikrotik:", err);
        reject(err);
      });
  });
