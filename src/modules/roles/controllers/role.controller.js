import { RoleService } from "../services/role.services.js";

export const createRole = async (req, res) => {
  try {
    const roleData = await RoleService.create(req.body);
    return res.status(200).json({ message: "Rol creado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const id = req.params.id;
    const roleData = req.body;
    const updatedRole = await RoleService.update(id, roleData);
    return res.status(200).json({
      message: "Rol actualizado con éxito",
      data: updatedRole,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await RoleService.findById(id);
    return res.status(200).json({
      message: "Rol encontrado con éxito",
      data: rol,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await RoleService.findAll();
    return res.status(200).json({
      message: "Roles encontrados con éxito",
      data: roles,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    await RoleService.delete(id);
    return res.status(200).send({
      message: "Rol eliminado con éxito",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
