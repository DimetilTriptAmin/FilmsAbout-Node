import { Router } from "express";

import filmService from "../../bussiness/services/filmService.js";

const router = Router()

router.get('/all', async (req, res) => {
    const films = await filmService.getAll()

    res.status(200).json(films)
})

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    const film = await filmService.get(id)

    res.status(200).json(film)
})

router.get('/id/bytitle/:title', async (req, res) => {
    const title = req.params.title

    const id = await filmService.getIdByTitle(title)

    res.status(200).json(id)
})

export default router