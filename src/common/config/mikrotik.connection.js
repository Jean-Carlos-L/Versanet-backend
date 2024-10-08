import { RouterOSAPI } from "node-routeros";
import {
  MIKROTIK_HOST,
  MIKROTIK_PASSWORD,
  MIKROTIK_PORT,
  MIKROTIK_USER,
} from "../constants/constants.js";

export const connection = () =>
  new Promise((resolve, reject) => {
    const conn = new RouterOSAPI({
      host: MIKROTIK_HOST,
      port: MIKROTIK_PORT,
      user: MIKROTIK_USER,
      password: MIKROTIK_PASSWORD,
      timeout: 30000, // Ajusta el timeout según sea necesario
    });
    // Conexión correcta a la API usando promesas
    conn
      .connect()
      .then(() => {
        console.log("Connection successfully established with Mikrotik");
        resolve(conn);
      })
      .catch((err) => {
        console.error("Error while trying to connect to Mikrotik", err);
        reject(err);
      });
  });
