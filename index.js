import express from "express";
import fs from "fs";
import https from "https";

import filmController from "./api/controllers/filmController.js";

const port = 4000;

const app = express();

app.use("/api/film", filmController);

https
  .createServer(
    {
      key: fs.readFileSync("localhost.decrypted.key"),
      cert: fs.readFileSync("localhost.crt"),
    },
    app
  )
  .listen(port, function () {
    console.log(`Server listening on port ${port}`);
  });
