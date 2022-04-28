import { Router } from "express";
import Joi from "joi";

import ratingService from "../../bussiness/services/ratingService.js";
import { CaslActions, CaslModels } from "../helpers/enums.js";

import { postSchema, getIdSchema } from "../validators/ratingValidators.js";

const router = Router();

router.get("/:id", async (req, res, next) => {
  try {
    await getIdSchema.validateAsync(req.params.id);
  } catch (err) {
    err.status = 400;
    return next(err);
  }

  try {
    const filmId = parseInt(req.params.id);
    const rate = await ratingService.get(req.user.userId, filmId);

    res.status(200).json(rate);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await postSchema.validateAsync(req.body);
  } catch (err) {
    err.status = 400;
    return next(err);
  }

  const ability = req.ability;
  if (!ability.can(CaslActions.create, CaslModels.comment)) {
    return res.sendStatus(401);
  }

  try {
    const newRating = await ratingService.set(
      req.user.userId,
      req.body.filmId,
      req.body.rate
    );

    res.status(200).json(newRating);
  } catch (err) {
    next(err);
  }
});

export default router;
