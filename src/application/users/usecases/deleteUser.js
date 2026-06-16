import { UserRepository } from "../../../infrastructure/repositories/userRepository.js";
import { NotificationBuilder } from "../../../infrastructure/email/notificationBuilder.js";
import { EmailStrategy } from "../../../infrastructure/email/notificationStrategies.js";
import { UserModel } from "../../../infrastructure/models/index.js";

const mailer = new EmailStrategy();
const notificationBuilder = new NotificationBuilder();
const userRepository = new UserRepository();

async function deleteUser(userId, actor = null) {
  const userToDelete = await userRepository.findById(userId);
  if (!userToDelete) {
    const error = new Error("Usuario no encontrado.");
    error.status = 404;
    throw error;
  }

  const t = await UserModel.sequelize.transaction();
  try {
    const deletionSuccess = await userRepository.delete(userId, actor, { transaction: t });
    if (!deletionSuccess) {
      const error = new Error("No se pudo eliminar el usuario.");
      error.status = 500;
      throw error;
    }
    await t.commit();

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
        mailError && mailError.message ? mailError.message : mailError
      );
    }

    return true;
  } catch (error) {
    try {
      await t.rollback();
    } catch (rbErr) {
      console.error("deleteUser - rollback failed:", rbErr && rbErr.message ? rbErr.message : rbErr);
    }
    throw error;
  }
}

export { deleteUser };