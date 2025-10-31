import AuthService from "../../../infrastructure/auth/authService.js";
import { UserRepository } from "../../../infrastructure/repositories/userRepository.js";

const userRepository = new UserRepository();

export const login = async (email, password) => {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("Usuario no encontrado.");
      error.status = 404;
      throw error;
    }

    const isPasswordValid = await AuthService.comparePassword(
      password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      const error = new Error("Contraseña incorrecta.");
      error.status = 401;
      throw error;
    }

    const token = AuthService.generateToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Error during login:", error);
  }
};
