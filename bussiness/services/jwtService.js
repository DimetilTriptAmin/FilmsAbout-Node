import jwt from "jsonwebtoken";

import jwtConfig from "../helpers/tokenConfig.js";
import userService from "./userService.js";

const generateAccessToken = (user) => {
  const payload = { userId: user.id, userRole: user.userRole };
  const options = { expiresIn: jwtConfig.tokens.access.expiresIn };

  return jwt.sign(payload, jwtConfig.secret, options);
};

const validateAccessToken = async (req) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  const options = { expiresIn: jwtConfig.tokens.access.expiresIn };

  if (!accessToken) {
    return false;
  }

  try {
    jwt.verify(accessToken, jwtConfig.secret, options);
    return true;
  } catch {
    return false;
  }
};

const generateRefreshToken = (user) => {
  const payload = { userId: user.id, userRole: user.userRole };
  const options = { expiresIn: jwtConfig.tokens.refresh.expiresIn };

  return jwt.sign(payload, jwtConfig.secret, options);
};

const getTokenPayload = async (req) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (accessToken === undefined) {
    return undefined;
  }

  return await jwt
    .verify(accessToken, jwtConfig.secret, async (err, decoded) => {
      if (err) {
        return undefined;
      }
      return decoded;
    })
    .catch(() => {
      return undefined;
    });
};

const refreshAccessToken = async (req) => {
  const refreshToken = req.cookies.refresh;

  return await jwt
    .verify(refreshToken, jwtConfig.secret, async (err, decoded) => {
      if (err) {
        console.log(err, "1")
        return {};
      }

      const user = await userService.get(decoded["userId"]);

      if (!user) {
        console.log(err, "!User")

        return {};
      }

      // let resultCHeck = await blackList.CheckBlackList(user.id, refreshToken);

      // if (!resultCHeck) {
      //   return {};
      // }

      // blackList.AddBlackList(user.id, refreshToken);

      return {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user),
      };
    })
    .catch(() => {
      return {};
    });
};

const jwtService = {
  generateAccessToken,
  generateRefreshToken,
  getTokenPayload,
  refreshAccessToken,
  validateAccessToken,
};

export default jwtService;
