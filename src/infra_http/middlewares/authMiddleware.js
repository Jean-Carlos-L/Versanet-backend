import AuthService from "../../infrastructure/auth/authService.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const user = AuthService.verifyToken(token);
    req.session = { user };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
