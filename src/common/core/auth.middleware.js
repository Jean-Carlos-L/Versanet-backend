import { verifyToken } from "../utils/jwt.util.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Obtén el token de las cookies
  if (!token) {
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    const decoded = verifyToken(token); // Verifica el token
    req.user = decoded; // Guarda la info del usuario decodificada en la solicitud
    next(); // Continua con la siguiente función de middleware o controlador
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const authorizeByPermission = (requiredPermissionUrl) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions; // Los permisos deben estar en el token o en la sesión

    const hasPermission = userPermissions.some(
      (permission) => permission.url === requiredPermissionUrl
    );

    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "No tienes permisos para acceder a este recurso" });
    }

    next();
  };
};
