import express from "express";
import {
  buildRegisterValidatorChain,
  buildEditValidatorChain,
} from "../../../infra_http/middlewares/validators/roles/index.js";
import {
  registerRole,
  listRoles,
  editRole,
  deleteRole,
  getRoleById,
} from "../usecases/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filters = req.query || {};
    const result = await listRoles({ filters });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const role = await getRoleById(id);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const userInput = req.body;
    const chain = buildRegisterValidatorChain();
    const validationResult = await chain.handle(userInput);
    if (!validationResult.ok) {
      return res.status(400).json({ error: validationResult.error });
    }

    const newRole = await registerRole(userInput);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userInput = req.body;
    const chain = buildEditValidatorChain();
    const validationResult = await chain.handle({ ...userInput, id });

    if (!validationResult.ok) {
      return res.status(400).json({ error: validationResult.error });
    }

    const updatedRole = await editRole(id, userInput);
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteRole(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
});

export default router;
