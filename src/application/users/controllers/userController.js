import express from "express";
import {
  buildRegisterValidatorChain,
  buildEditValidatorChain,
} from "../../../infra_http/middlewares/validators/users/index.js";
import {
  getUserById,
  deleteUser,
  editUser,
  listUsers,
  registerUser,
} from "../usecases/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const filters = req.query;

  try {
    const users = await listUsers({ filters });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const chain = buildRegisterValidatorChain();
  const validationResult = await chain.handle(req.body);
  if (!validationResult.ok)
    return res.status(400).json({ error: validationResult.error });

  try {
    const user = await registerUser(req.body);
    res.status(201).json({ data: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.id;

  const chain = buildEditValidatorChain();
  const validationResult = await chain.handle({ ...req.body, id: userId });
  if (!validationResult.ok)
    return res.status(400).json({ error: validationResult.error });

  try {
    const user = await editUser(userId, req.body);
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(err.status).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    await deleteUser(userId);
    res.status(200).json({ message: "Usuario eliminado correctamente." });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
