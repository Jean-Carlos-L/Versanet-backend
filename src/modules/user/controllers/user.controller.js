import { UserService } from "../services/user.service.js";

export const createUser = async (req, res) => {
  try {
    const user = UserService.createUser(req.body);
    return res.status(201).json({ message: "Usuario creado con exito" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    await UserService.updateUser(id, userData);
    return res.status(200).json({ message: "Usuario actualizado con exito" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const detailsUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.findById(id);
    return res.status(200).json({
      message: "Usuario encontrado con exito",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const listUser = async (req, res) => {
  try {
    const users = await UserService.findAll();
    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
