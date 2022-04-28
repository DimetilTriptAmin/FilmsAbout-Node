import oracledb from "oracledb";

import { executeStoredProcedure } from "../db/dbExtensions.js";

const get = async (id) => {
  const data = {
    cursorparam: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
    id_in: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: id },
  };

  const outBinds = await executeStoredProcedure("sp_user_get_by_id", data);

  const user = outBinds.cursorparam.shift();

  return user;
};

const getByEmail = async (email) => {
  const data = {
    cursorparam: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
    email_in: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: email },
  };

  const outBinds = await executeStoredProcedure("sp_user_get_by_email", data);

  const user = outBinds.cursorparam.shift();

  return user;
};

const getByUsername = async (username) => {
  const data = {
    cursorparam: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
    username_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: username,
    },
  };

  const outBinds = await executeStoredProcedure(
    "sp_user_get_by_username",
    data
  );

  const user = outBinds.cursorparam.shift();

  return user;
};

const getEmails = async () => {
  const data = {
    cursorparam: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
  };

  const outBinds = await executeStoredProcedure("sp_user_get_emails", data);

  const emails = outBinds.cursorparam;

  return emails;
};

const updatePassword = async (updatePasswordModel) => {
  const data = {
    user_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: updatePasswordModel.id,
    },
    new_password_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: updatePasswordModel.newPasswordHash,
    },
    user_id_out: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
  };

  const outBinds = await executeStoredProcedure(
    "sp_user_update_password",
    data
  );

  const userId = outBinds.user_id_out;

  return userId;
};

const updateAvatar = async (updateAvatarModel) => {
  const data = {
    user_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: updateAvatarModel.userId,
    },
    avatar_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: updateAvatarModel.avatar,
    },
    user_id_out: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
  };

  const outBinds = await executeStoredProcedure("sp_user_update_avatar", data);

  const userId = outBinds.user_id_out;

  return userId;
};

const register = async (registerModel) => {
  const data = {
    username_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: registerModel.username,
    },
    passwordHash_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: registerModel.passwordHash,
    },
    email_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: registerModel.email,
    },
    avatar_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: registerModel.avatarClob,
    },
    user_id_out: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
  };

  const outBinds = await executeStoredProcedure("sp_user_register", data);

  const userId = outBinds.user_id_out;

  return userId;
};

const userRepository = {
  get,
  getByEmail,
  getByUsername,
  getEmails,
  updatePassword,
  register,
  updateAvatar,
};

export default userRepository;
