import AuthService from "../../../infrastructure/auth/authService.js";
import { UserRepository } from "../../../infrastructure/repositories/userRepository.js";
import { EmailStrategy } from "../../../infrastructure/email/notificationStrategies.js";
import { NotificationBuilder } from "../../../infrastructure/email/notificationBuilder.js";
import { createRecoverCodeNotification } from "../utils/createRecoverCodeNotification.js";

const userRepository = new UserRepository();

export const generateCodeToRecoverPass = async (email) => {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const code = AuthService.generateCode();
    user.recoveryCode = code;
    await userRepository.updateRecoveryCode(user.id, code);

    const emailHtml = createRecoverCodeNotification({ code });
    const emailNotification = new NotificationBuilder()
      .to(user.email)
      .subject("Password Recovery Code")
      .html(emailHtml)
      .build();
    await new EmailStrategy().send(emailNotification);

    return code;
  } catch (error) {
    console.error("Error generating recovery code:", error.message);
    throw new Error(error.message || "Error generating recovery code");
  }
};
