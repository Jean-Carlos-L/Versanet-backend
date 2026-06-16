import { UserRepository } from "../../../infrastructure/repositories/userRepository.js";

const userRepository = new UserRepository();

async function getUserById(userId) {
  const user = await userRepository.findById(userId);
  return user;
}

export { getUserById };