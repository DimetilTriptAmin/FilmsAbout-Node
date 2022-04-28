import fs from "fs";

import passwordManager from "../helpers/passwordManager.js";
import jwtService from "./jwtService.js";
import userDbToServiceMap from "../mappers/userDbToServiceMap.js";
import userDbToResponseModel from "../mappers/userDbToResponseModel.js";
import userRepository from "../../data/repositories/userRepository.js";
import ServiceError from "../helpers/serviceError.js";

const login = async (username, password) => {
  const dbUser = await userRepository.getByUsername(username);

  if (!dbUser) {
    throw new ServiceError("Invalid username or password", 400);
  }

  const user = userDbToServiceMap(dbUser);

  const isPasswordCorrect = passwordManager.checkPassword(
    password,
    user.passwordHash
  );

  if (!isPasswordCorrect) {
    throw new ServiceError("Invalid username or password", 400);
  }

  const accessToken = jwtService.generateAccessToken(user);
  const refreshToken = jwtService.generateRefreshToken(user);

  return { accessToken, refreshToken };
};

const register = async (username, password, email) => {
  const useByName = await userRepository.getByUsername(username);

  if (useByName) {
    throw new ServiceError("This username is already taken", 400);
  }

  const useByEmail = await userRepository.getByEmail(email);

  if (useByEmail) {
    throw new ServiceError("This email is already taken", 400);
  }

  const passwordHash = passwordManager.hashPassword(password);

  const bitmap = fs.readFileSync(
    "D:\\University\\6sem\\Course\\data\\assets\\default-avatar.png"
  );
  const avatarClob = Buffer.from(bitmap).toString("base64");

  const registerModel = {
    username,
    passwordHash,
    email,
    avatarClob,
  };

  const userId = await userRepository.register(registerModel);

  const user = await userRepository.get(userId);

  const accessToken = jwtService.generateAccessToken(user);

  return accessToken;
};

const get = async (userId) => {
  const dbUser = await userRepository.get(userId);

  if (!dbUser) {
    throw new ServiceError("No such user", 400);
  }

  const user = userDbToResponseModel(dbUser);

  return user;
};

const updatePassword = async (userId, oldPassword, newPassword) => {
  const dbUser = await userRepository.get(userId);

  if (!dbUser) {
    throw new ServiceError("No such user", 400);
  }

  const user = userDbToServiceMap(dbUser);

  const isPasswordCorrect = passwordManager.checkPassword(
    oldPassword,
    user.passwordHash
  );

  if (!isPasswordCorrect) {
    throw new ServiceError("Password is incorrect", 400);
  }

  const updateModel = {
    id: userId,
    newPasswordHash: passwordManager.hashPassword(newPassword),
  };

  await userRepository.updatePassword(updateModel);
};

const updateAvatar = async (userId, avatar) => {
  const dbUser = await userRepository.get(userId);

  if (!dbUser) {
    throw new ServiceError("No such user", 400);
  }

  const updateModel = {
    userId,
    avatar,
  };

  await userRepository.updateAvatar(updateModel);

  return avatar;
};

const userService = {
  login,
  register,
  get,
  updatePassword,
  updateAvatar,
};

export default userService;
