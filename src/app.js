import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

export default app;
