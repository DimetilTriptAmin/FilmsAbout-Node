import { Router } from "express";

import filmService from "../../bussiness/services/filmService.js";

const router = Router();

router.get("/all", async (req, res, next) => {
  try {
    const films = await filmService.getAll();

    res.status(200).json(films);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const film = await filmService.get(id);

    res.status(200).json(film);
  } catch (err) {
    next(err);
  }
});

router.get("/id/bytitle/:title", async (req, res, next) => {
  try {
    const title = req.params.title;

    const id = await filmService.getIdByTitle(title);

    res.status(200).json(id);
  } catch (err) {
    next(err);
  }
});

export default router;
