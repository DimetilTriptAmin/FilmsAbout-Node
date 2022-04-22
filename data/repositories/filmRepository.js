import oracledb from "oracledb";

import { executeStoredProcedure } from "../db/dbExtensions.js";

const getAll = async () => {
  const data = {
    cursorparam: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
  };

  const outBinds = await executeStoredProcedure("sp_film_get_all", data)

  const films = outBinds.cursorparam;

  return films;
};

const get = async (id) => {
  const data = {
    cursorparam: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
    id_in: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: id },
  };

  const outBinds = await executeStoredProcedure("sp_film_get_by_id", data)

  const films = outBinds.cursorparam;

  return films;
};

const getIdByTitle = async (title) => {
  const data = {
    title_in: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: title },
    id_out: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
  };

  const outBinds = await executeStoredProcedure("sp_film_get_id_by_title", data)

  const resultId = outBinds.id_out;

  return resultId;
};

const create = async (film) => {
  const { title, description, trailerLink, producer, poster } = film;

  const data = {
    description_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: description,
    },
    poster_in: { dir: oracledb.BIND_IN, type: oracledb.CLOB, val: poster },
    producer_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: producer,
    },
    title_in: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: title },
    trailer_link_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: trailerLink,
    },
    id_out: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
  };

  const resultId = await executeStoredProcedure("sp_film_create", data);

  return resultId;
};

const filmRepository = {
  getAll,
  get,
  getIdByTitle,
  create,
};

export default filmRepository;
