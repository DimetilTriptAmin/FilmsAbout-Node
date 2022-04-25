import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { errorHandler } from "./api/helpers/errorHandler.js";
import caslConfig from "./api/helpers/caslConfig.js";
import corsConfig from "./api/helpers/corsConfig.js";

import filmController from "./api/controllers/filmController.js";
import userController from "./api/controllers/userController.js";
import commentController from "./api/controllers/commentController.js";
import ratingController from "./api/controllers/ratingController.js"

import userService from "./bussiness/services/userService.js";

const test = async () => {
  const user = await userService.login('user', '')
  console.log(user)
}

//test()

const port = 4000;

const app = express();

app.use(cors(corsConfig));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(caslConfig)

app.use("/api/film", filmController);
app.use("/api/user", userController);
app.use("/api/comment", commentController);
app.use("/api/rating", ratingController);


app.use(errorHandler);

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
