import hasher from "node-hasher";

const hashPassword = (password) => {
  return hasher("md5", password);
};

const checkPassword = (password, passwordHash) => {
  return hashPassword(password) === passwordHash;
};

const passwordManager = {
  hashPassword,
  checkPassword,
};

export default passwordManager;
