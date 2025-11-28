import { UserRepository } from "../../../infrastructure/repositories/userRepository.js";
import { NotificationBuilder } from "../../../infrastructure/email/notificationBuilder.js";
import { EmailStrategy } from "../../../infrastructure/email/notificationStrategies.js";
import AuthService from "../../../infrastructure/auth/authService.js";
import { EditUserDTO } from "../../../domain/dtos/editUserDTO.js";

const mailer = new EmailStrategy();
const notificationBuilder = new NotificationBuilder();
const userRepository = new UserRepository();

async function editUser(userId, userInput) {
  const userDTO = new EditUserDTO(userInput);
  let existingUser = await userRepository.findById(userId);
  if (!existingUser) {
    const error = new Error("Usuario no encontrado.");
    error.status = 404;
    throw error;
  }

  existingUser = await userRepository.findByEmail(userDTO.email);
  if (existingUser && existingUser.id !== userId) {
    const error = new Error("El correo electrónico ya está registrado.");
    error.status = 400;
    throw error;
  }

  if (userDTO.password) {
    const hashedPassword = await AuthService.hashPassword(userDTO.password);
    userDTO.passwordHash = hashedPassword;
  }

  const updatedUser = await userRepository.update(userId, userDTO);
  
  try {
    const notification = notificationBuilder
      .to(updatedUser.email)
      .subject("¡Tus datos han sido actualizados!")
      .html(
        `<h1>Hola ${updatedUser.name},</h1><p>Tu información en Versanet ha sido actualizada correctamente.</p>`
      )
      .build();

    await mailer.send(notification);

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (mailError) {
    console.error(
      "⚠️ No se pudo enviar el correo de notificación de actualización:",
      mailError.message
    );
  }
}

export { editUser };
