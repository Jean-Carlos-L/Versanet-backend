import { UserRepository } from "../../../infrastructure/repositories/userRepository.js";
import { NotificationBuilder } from "../../../infrastructure/email/notificationBuilder.js";
import { EmailStrategy } from "../../../infrastructure/email/notificationStrategies.js";
import { RegisterUserDTO } from "../../../domain/dtos/registerUserDTO.js";
import AuthService from "../../../infrastructure/auth/authService.js"

const mailer = new EmailStrategy();
const notificationBuilder = new NotificationBuilder();
const userRepository = new UserRepository();

async function registerUser(userInput) {
  const userDTO = new RegisterUserDTO(userInput);

  const existingUser = await userRepository.findByEmail(userDTO.email);
  if (existingUser) {
    const error = new Error("El correo electrónico ya está registrado.");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await AuthService.hashPassword(userDTO.password);
  userDTO.passwordHash = hashedPassword;

  const newUser = await userRepository.create(userDTO);

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
      mailError.message
    );
  }

  const { passwordHash, ...userWithoutPassword } = newUser
  return userWithoutPassword;
}

export { registerUser };
