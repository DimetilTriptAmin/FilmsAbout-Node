import oracledb from "oracledb";

import { executeStoredProcedure } from "../db/dbExtensions.js";

const get = async (id) => {
  const data = {
    comment_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: id,
    },
    cursorparam: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
  };

  const outBinds = await executeStoredProcedure("SP_COMMENT_GET_BY_ID", data);

  const comments = outBinds.cursorparam;

  return comments.shift();
};

const create = async (createModel) => {
  const data = {
    text_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: createModel.text,
    },
    publish_date_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.DATE,
      val: createModel.publishDate,
    },
    is_deleted_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: 0,
    },
    film_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: createModel.filmId,
    },
    user_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: createModel.userId,
    },
    id_out: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
  };

  const outBinds = await executeStoredProcedure("sp_comment_create", data);

  const resultId = outBinds.id_out;

  return resultId;
};

const destroy = async (id) => {
  const data = {
    comment_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: id,
    },
    comment_id_out: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
  };

  const outBinds = await executeStoredProcedure("sp_comment_delete", data);

  const resultId = outBinds.id_out;

  return resultId;
};

const getPage = async (getModel) => {
  const data = {
    film_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: getModel.filmId,
    },
    page_number_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: getModel.pageNumber,
    },
    page_size_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: getModel.pageSize,
    },
    cursorparam: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
  };

  const outBinds = await executeStoredProcedure("sp_comment_get_page", data);

  const comments = outBinds.cursorparam;

  return comments;
};

const getPagesAmount = async (getModel) => {
  const data = {
    film_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: getModel.filmId,
    },
    page_size_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: getModel.pageSize,
    },
    pages_amount_out: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
  };

  const outBinds = await executeStoredProcedure(
    "sp_comment_get_pages_amount",
    data
  );

  const amount = outBinds.pages_amount_out;

  return amount;
};

const update = async (updateModel) => {
  const data = {
    comment_id_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: updateModel.commentId,
    },
    text_in: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: updateModel.text,
    },
    comment_id_out: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER,
    },
  };

  const outBinds = await executeStoredProcedure("sp_comment_update", data);

  const resultId = outBinds.comment_id_out;

  return resultId;
};

const commentRepository = {
  get,
  create,
  destroy,
  getPage,
  getPagesAmount,
  update,
};

export default commentRepository;
