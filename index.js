import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";

import { errorHandler } from "./api/helpers/errorHandler.js";
import filmController from "./api/controllers/filmController.js";

const port = 4000;

const app = express();

app.use(cors());

app.use(errorHandler);
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
