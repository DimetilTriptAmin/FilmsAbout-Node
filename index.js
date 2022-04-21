import express from "express";

import filmController from './api/controllers/filmController.js'

const port = 4000

const app = express()

app.use("/api/film", filmController)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})