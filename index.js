import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { Server } from "rpc-websockets";

import { errorHandler } from "./api/helpers/errorHandler.js";
import caslConfig from "./api/helpers/caslConfig.js";
import corsConfig from "./api/helpers/corsConfig.js";
import wsEvents from "./api/helpers/wsEvents.js";

import filmController from "./api/controllers/filmController.js";
import userController from "./api/controllers/userController.js";
import commentController from "./api/controllers/commentController.js";
import ratingController from "./api/controllers/ratingController.js";
import tokenDecoder from "./api/helpers/tokenDecoder.js";

const port = 4000;
const wsPort = 5000;

const app = express();

app.use(cors(corsConfig));
app.use(tokenDecoder)
app.use(caslConfig);
app.use(cookieParser());
app.use(bodyParser.json());

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

export const eventSocket = new Server({ port: wsPort, host: 'localhost'});

eventSocket.event(wsEvents.commentAdded);
eventSocket.event(wsEvents.commentEdited);
eventSocket.event(wsEvents.commentDeleted);
