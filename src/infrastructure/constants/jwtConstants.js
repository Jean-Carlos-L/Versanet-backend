// Leer variables de entorno y proporcionar valores por defecto y trim
export const JWT_SECRET = (process.env.JWT_SECRET || "mysecretkey").toString();
export const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d").toString().trim();
