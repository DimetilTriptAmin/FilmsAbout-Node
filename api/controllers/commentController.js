import { Router } from "express";
import * as core from "@casl/ability";

import { eventSocket } from "../../index.js";
import commentService from "../../bussiness/services/commentService.js";
import wsEvents from "../helpers/wsEvents.js";
import { CaslActions, CaslModels } from "../helpers/enums.js";
import {
  deleteSchema,
  getPageAmountByIdSchema,
  getPageByIdSchema,
  postSchema,
  putSchema,
} from "../validators/commentValidators.js";

const router = Router();

router.get("/:filmId/:pageNumber/:pageSize", async (req, res, next) => {
  try {
    await getPageByIdSchema.validateAsync(req.params);
  } catch (err) {
    err.status = 400;
    return next(err);
  }

  try {
    const filmId = parseInt(req.params.filmId);
    const pageNumber = parseInt(req.params.pageNumber);
    const pageSize = parseInt(req.params.pageSize);

    const comments = await commentService.getPage(filmId, pageNumber, pageSize);

    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
});

router.get("/:filmId/:pageSize/", async (req, res, next) => {
  try {
    await getPageAmountByIdSchema.validateAsync(req.params);
  } catch (err) {
    err.status = 400;
    return next(err);
  }

  try {
    const filmId = parseInt(req.params.filmId);
    const pageSize = parseInt(req.params.pageSize);

    const comments = await commentService.getPagesAmount(filmId, pageSize);

    res.status(200).json(comments);
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
    const filmId = parseInt(req.body.filmId);

    const comment = await commentService.create(
      req.user.userId,
      filmId,
      req.body.text
    );

    eventSocket.emit(wsEvents.commentAdded, comment);

    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteSchema.validateAsync(req.params.id);
  } catch (err) {
    err.status = 400;
    return next(err);
  }

  const ability = req.ability;
  const commentId = parseInt(req.params.id);

  try {
    const comment = await commentService.get(commentId);

    if (
      !ability.can(CaslActions.delete, core.subject(CaslModels.comment, comment))
    ) {
      return res.sendStatus(401);
    }

    await commentService.destroy(commentId);

    eventSocket.emit(wsEvents.commentDeleted, { commentId });

    res.status(200).json(commentId);
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    await putSchema.validateAsync(req.body);
  } catch (err) {
    err.status = 400;
    return next(err);
  }

  const ability = req.ability;
  const commentId = parseInt(req.body.commentId);

  try {
    const comment = await commentService.get(commentId);

    if (
      !ability.can(CaslActions.update, core.subject(CaslModels.comment, comment))
    ) {
      return res.sendStatus(401);
    }

    await commentService.update(commentId, req.body.text);

    eventSocket.emit(wsEvents.commentEdited, {
      commentId,
      text: req.body.text,
    });

    res.status(200).json(commentId);
  } catch (err) {
    next(err);
  }
});

export default router;
