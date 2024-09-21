import { RoleService } from "../services/role.services.js";

export const createRole = async (req, res) => {
  try {
    const roleData = req.body; 
    const newRole = await RoleService.createRole(roleData);
    return res.status(201).json(newRole);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const roleData = req.body; 
    const updatedRole = await RoleService.updateRole(roleData);
    return res.status(200).json(updatedRole);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const detailsRole = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await RoleService.findById(id);
    return res.status(200).json(rol);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const listRole = async (req, res) => {
  try {
    const roles = await RoleService.findAll();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    await RoleService.deleteRol(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
