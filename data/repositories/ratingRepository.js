import oracledb from "oracledb";

import { executeStoredProcedure } from "../db/dbExtensions.js";

const set = async (setModel) => {
  const data = {
    rate_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: setModel.rate,
    },
    film_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: setModel.filmId,
    },
    user_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: setModel.userId,
    },
    film_rating_out: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
  };

  const outBinds = await executeStoredProcedure("sp_rating_set", data);

  const filmRating = outBinds.film_rating_out;

  return filmRating;
};

const get = async (getModel) => {
  const data = {
    film_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: getModel.filmId,
    },
    user_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: getModel.userId,
    },
    cursorparam: {
      dir: oracledb.BIND_OUT,
      type: oracledb.CURSOR,
    },
  };

  const outBinds = await executeStoredProcedure("sp_rating_get_for_user", data);

  const filmRating = outBinds.cursorparam;

  return filmRating.shift();
};

const ratingRepository = {
  set,
  get,
};

export default ratingRepository;
