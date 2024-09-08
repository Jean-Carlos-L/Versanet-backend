import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { RouterOSAPI } from "node-routeros";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  const conn = new RouterOSAPI({
    host: "172.16.0.1",
    port: 8728,
    user: "admin",
    password: "",
  });
  conn
    .connect()
    .then(() => {
      // Connection successful
      console.log("Connected");
      
    })
    .catch((err) => {
      // Got an error while trying to connect
      console.log(err);
    });
  res.json({
    message: "Welcome to the API",
  });
});

export default app;
