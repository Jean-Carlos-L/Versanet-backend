import { AuthService } from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);

    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ message: "Autenticación exitosa", data: user });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    // Elimina la cookie del token
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    return res.status(200).json({ message: "Sesión cerrada con éxito" });
  } catch (error) {
    return res.status(500).json({ message: "Error al cerrar sesión" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    await AuthService.resetPassword(email, password);

    return res.status(200).json({ message: "Contraseña actualizada" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
