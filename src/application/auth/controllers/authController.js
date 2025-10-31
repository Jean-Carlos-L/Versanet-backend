import express from "express";
import { login } from "../usecases/login.js";
import { buildLoginValidatorChain } from "../../../infra_http/middlewares/validators/loginValidator.js";

const router = express.Router();

const chain = buildLoginValidatorChain();

router.post("/login", async (req, res) => {
  const validationResult = await chain.handle(req.body);
  if (!validationResult.ok) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { email, password } = req.body;
  const result = await login(email, password);
  if (!result) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res
    .cookie("access_token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .json(result.user);
});

router.post("/logout", (req, res) => {
  res.clearCookie("access_token").json({ message: "Logged out successfully" });
});

export default router;
