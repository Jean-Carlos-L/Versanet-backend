import { PermissionService } from "../services/permission.service.js";

export const getPermissions = async (req, res) => {
  try {
    const permissions = await PermissionService.findAll();
    return res.status(200).json({
      message: "Permisos encontrados con éxito",
      data: permissions,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
