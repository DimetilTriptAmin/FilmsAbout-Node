import ServiceError from "../helpers/serviceError.js";
import commentRepository from "../../data/repositories/commentRepository.js";
import commentResponseMap from "../mappers/commentResponseMap.js";
import commentServiceMap from "../mappers/commentServiceMap.js";
import userService from "./userService.js";
import ratingService from "./ratingService.js";

const get = async (id) => {
  const commentDb = await commentRepository.get(id);

  const comment = commentServiceMap(commentDb);

  return comment;
};

const create = async (userId, filmId, text) => {
  const publishDate = new Date()

  const createModel = {
    text,
    publishDate,
    filmId,
    userId,
  };

  const resultId = await commentRepository.create(createModel);

  const user = await userService.get(userId)
  const rating = await ratingService.get(userId, filmId)

  const responseModel = {
    id: resultId,
    username: user.userName,
    avatar: user.avatar,
    text,
    publishDate,
    rating: rating.rate
  }

  return responseModel;
};

const destroy = async (commentId) => {
  const resultId = await commentRepository.destroy(commentId);

  if (resultId === -1) {
    throw new ServiceError("Comment not found", 404);
  }

  return resultId;
};

const getPage = async (filmId, pageNumber = 1, pageSize = 10) => {
  const getModel = {
    filmId,
    pageNumber,
    pageSize,
  };

  const commentsDb = await commentRepository.getPage(getModel);

  const comments = commentsDb.map((comment) => commentResponseMap(comment));

  return comments;
};

const getPagesAmount = async (filmId, pageSize = 10) => {
  const getModel = {
    filmId,
    pageSize,
  };

  const amount = await commentRepository.getPagesAmount(getModel);

  return amount;
};

const update = async (commentId, text) => {
  const updateModel = {
    commentId,
    text,
  };

  const id = await commentRepository.update(updateModel);

  return id;
};

const commentService = {
  get,
  create,
  destroy,
  getPage,
  getPagesAmount,
  update,
};

export default commentService;
