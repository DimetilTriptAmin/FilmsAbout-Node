import { Router } from "express";

import userService from "../../bussiness/services/userService.js";
import jwtService from "../../bussiness/services/jwtService.js";
import JwtConfig from "../../bussiness/helpers/tokenConfig.js";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  changeAvatarSchema,
} from "../validators/userValidators.js";
import { CaslActions, CaslModels } from "../helpers/enums.js";

const router = Router();

router.get("/", async (req, res) => {
  const ability = req.ability;
  if (!ability.can(CaslActions.read, CaslModels.user)) {
    return res.sendStatus(401);
  }

  const id = req.user.userId;

  const user = await userService.get(id);

  return res.status(200).json(user);
});

router.post("/login", async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
  } catch (err) {
    err.status = 400;
    return next(err);
  }

  try {
    const { accessToken, refreshToken } = await userService.login(
      req.body.username,
      req.body.password
    );
    res.cookie(
      JwtConfig.tokens.refresh.type,
      refreshToken,
      JwtConfig.refreshOptions
    );
    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    await registerSchema.validateAsync(req.body);
  } catch (err) {
    err.status = 400;
    return next(err);
  }

  try {
    const token = await userService.register(
      req.body.username,
      req.body.password,
      req.body.email
    );
    return res.status(200).json(token);
  } catch (err) {
    next(err);
  }
});

router.put("/password", async (req, res, next) => {
  const ability = req.ability;
  if (!ability.can(CaslActions.update, CaslModels.user)) {
    return res.sendStatus(401);
  }

  try {
    await changePasswordSchema.validateAsync(req.body);
  } catch (err) {
    err.status = 400;
    return next(err);
  }

  try {
    await userService.updatePassword(
      req.user.userId,
      req.body.oldPassword,
      req.body.newPassword
    );
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.put("/avatar", async (req, res, next) => {
  const ability = req.ability;
  if (!ability.can(CaslActions.update, CaslModels.user)) {
    return res.sendStatus(401);
  }

  try {
    await changeAvatarSchema.validateAsync(req.body);
  } catch (err) {
    err.status = 400;
    return next(err);
  }

  try {
    const avatar = await userService.updateAvatar(
      req.user.userId,
      req.body.avatar
    );
    return res.status(200).json({ avatar });
  } catch (err) {
    next(err);
  }
});

router.put("/refresh", async (req, res, next) => {
  const ability = req.ability;
  if (!ability.can(CaslActions.read, CaslModels.user)) {
    return res.sendStatus(401);
  }

  try {
    const { accessToken, refreshToken } = await jwtService.refreshAccessToken(
      req
    );

    if (!accessToken || !refreshToken) {
      return res.sendStatus(401);
    }

    res.cookie(
      JwtConfig.tokens.refresh.type,
      refreshToken,
      JwtConfig.refreshOptions
    );
    return res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
});

export default router;
