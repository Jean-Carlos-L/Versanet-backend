import { verifyToken } from "../utils/jwt.util.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Obtén el token de las cookies
  if (!token) {
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    const decoded = verifyToken(token); // Verifica el token
    req.user = decoded; // Guarda la info del usuario decodificada en la solicitud
    console.log("User: ", req.user);
    next(); // Continua con la siguiente función de middleware o controlador
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
