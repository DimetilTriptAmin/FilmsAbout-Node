import ratingRepository from "../../data/repositories/ratingRepository.js";
import ratingToServiceMap from "../mappers/ratingToServiceMap.js"

const get = async (userId, filmId) => {
  const getModel = {
    filmId,
    userId,
  };

  const ratingDb = await ratingRepository.get(getModel);

  if (!ratingDb) {
    return {}
  }

  const rating = ratingToServiceMap(ratingDb)

  return rating;
};

const set = async (userId, filmId, rate) => {
  const setModel = {
    userId,
    filmId,
    rate,
  };

  const newFilmRating = await ratingRepository.set(setModel);

  return newFilmRating;
};

const ratingService = {
  get,
  set,
};

export default ratingService;
