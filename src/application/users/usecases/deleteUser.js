import { UserRepository } from "../../../infrastructure/repositories/userRepository.js";
import { NotificationBuilder } from "../../../infrastructure/email/notificationBuilder.js";
import { EmailStrategy } from "../../../infrastructure/email/notificationStrategies.js";

const mailer = new EmailStrategy();
const notificationBuilder = new NotificationBuilder();
const userRepository = new UserRepository();

async function deleteUser(userId) {
  const userToDelete = await userRepository.findById(userId);
  if (!userToDelete) {
    const error = new Error("Usuario no encontrado.");
    error.status = 404;
    throw error;
  }

  const deletionSuccess = await userRepository.delete(userId);
  if (!deletionSuccess) {
    const error = new Error("No se pudo eliminar el usuario.");
    error.status = 500;
    throw error;
  }

  try {
    const notification = notificationBuilder
      .to(userToDelete.email)
      .subject("Cuenta eliminada")
      .html(
        `<h1>Hola ${userToDelete.name},</h1><p>Tu cuenta en Versanet ha sido eliminada correctamente. Si esto fue un error, por favor contacta con soporte.</p>`
      )
      .build();

    await mailer.send(notification);
  } catch (mailError) {
    console.error(
      "⚠️ No se pudo enviar el correo de notificación de eliminación:",
      mailError.message
    );
  }

  return true;
}

export { deleteUser };