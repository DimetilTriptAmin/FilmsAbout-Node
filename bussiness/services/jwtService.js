import jwt from "jsonwebtoken";

import jwtConfig from "../helpers/tokenConfig.js";
import userService from "./userService.js";
import jwtBlackListService from "./jwtBlackListService.js";

const generateAccessToken = (user) => {
  const payload = { userId: user.id, userRole: user.role };
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
  const payload = { userId: user.id, userRole: user.role };
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
        return {};
      }

      const user = await userService.get(decoded["userId"]);

      if (!user) {
        return {};
      }

      const resultCHeck = await jwtBlackListService.CheckBlackList(
        user.id,
        refreshToken
      );

      if (!resultCHeck) {
        return {};
      }

      jwtBlackListService.AddBlackList(user.id, refreshToken);

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
