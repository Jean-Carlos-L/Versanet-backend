import { UserRepository } from "../../../infrastructure/repositories/userRepository.js";
import { NotificationBuilder } from "../../../infrastructure/email/notificationBuilder.js";
import { EmailStrategy } from "../../../infrastructure/email/notificationStrategies.js";
import { RegisterUserDTO } from "../../../domain/dtos/registerUserDTO.js";
import AuthService from "../../../infrastructure/auth/authService.js";
import { UserModel } from "../../../infrastructure/models/index.js";

const mailer = new EmailStrategy();
const notificationBuilder = new NotificationBuilder();
const userRepository = new UserRepository();

async function registerUser(userInput, actor = null) {
  const userDTO = new RegisterUserDTO(userInput);

  const existingUser = await userRepository.findByEmail(userDTO.email);
  if (existingUser) {
    const error = new Error("El correo electrónico ya está registrado.");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await AuthService.hashPassword(userDTO.password);
  userDTO.passwordHash = hashedPassword;

  const t = await UserModel.sequelize.transaction();
  try {
    const newUser = await userRepository.create(userDTO, actor, { transaction: t });
    await t.commit();

    try {
      const notification = notificationBuilder
        .to(newUser.email)
        .subject("¡Bienvenido a Versanet!")
        .html(
          `<h1>Hola ${newUser.name},</h1><p>Ahora formas parte de Versanet.</p>`
        )
        .build();

      await mailer.send(notification);
    } catch (mailError) {
      console.error(
        "⚠️ No se pudo enviar el correo de bienvenida:",
        mailError && mailError.message ? mailError.message : mailError
      );
    }

    const { passwordHash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    try {
      await t.rollback();
    } catch (rbErr) {
      console.error("registerUser - rollback failed:", rbErr && rbErr.message ? rbErr.message : rbErr);
    }
    throw error;
  }
}

export { registerUser };
