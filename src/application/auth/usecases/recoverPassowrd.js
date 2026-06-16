import AuthService from "../../../infrastructure/auth/authService.js";
import { UserRepository } from "../../../infrastructure/repositories/userRepository.js";

const userRepository = new UserRepository();

export const recoverPassword = async ({email, password, code}) => {
    try {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new Error("User not found");

        if (!user.isSameRecoverCode(code)) {
            throw new Error("Invalid recovery code");
        }

        const hashedPassword = await AuthService.hashPassword(password);
        await userRepository.updatePassword(user.id, hashedPassword);
        await userRepository.updateRecoveryCode(user.id, null);

        return {
            message: "Password recovered successfully"
        }
        
    } catch (error) {
        throw new Error(error.message || "Error recovering password");
    }
}