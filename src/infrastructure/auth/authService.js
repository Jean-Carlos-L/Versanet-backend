import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../constants/jwtConstants.js";

class AuthService {
  constructor() {
    if (AuthService.instance) return AuthService.instance;
    this.jwtSecret = JWT_SECRET;
    this.jwtExpiresIn = JWT_EXPIRES_IN;
    AuthService.instance = this;
  }

  async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(payload) {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      console.error("❌ Invalid or expired token:", error.message);
      return null;
    }
  }
}

export default new AuthService();
