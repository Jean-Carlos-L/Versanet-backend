import bcrypt from "bcrypt";

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, receivedPassword) => {
  const isPasswordValid = await bcrypt.compare(password, receivedPassword);
  return isPasswordValid;
};
