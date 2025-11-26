import express from "express";
import {
  login,
  generateCodeToRecoverPass,
  recoverPassword,
} from "../usecases/index.js";
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

router.post("/generate-recovery-code", async (req, res) => {
  const { email } = req.body;
  try {
    const code = await generateCodeToRecoverPass(email);
    res.json({ message: "Recovery code generated and sent to email.", code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/recover-password", async (req, res) => {
  const { email, password, code } = req.body;
  try {
    const result = await recoverPassword({ email, password, code });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
