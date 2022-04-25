import { Router } from "express";

import commentService from "../../bussiness/services/commentService.js";

const router = Router();

router.get("/:filmId/:pageNumber/:pageSize", async (req, res) => {
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

router.get("/:filmId/:pageSize/", async (req, res) => {
  try {
    const filmId = parseInt(req.params.filmId);
    const pageSize = parseInt(req.params.pageSize);

    const comments = await commentService.getPagesAmount(filmId, pageSize);

    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  try {
    const filmId = parseInt(req.body.filmId);

    const comment = await commentService.create(
      req.user.userId,
      filmId,
      req.body.text
    );

    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  try {
    const commentId = parseInt(req.params.id);

    await commentService.destroy(commentId);

    res.status(200).json(commentId);
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  try {
    const commentId = parseInt(req.body.commentId);

    await commentService.update(commentId, req.body.text);

    res.status(200).json(commentId);
  } catch (err) {
    next(err);
  }
});

export default router;
