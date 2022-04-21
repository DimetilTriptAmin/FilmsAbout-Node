import oracledb from "oracledb";
import { getConnection, options } from "./dbConnection.js";

export const executeStoredProcedure = async (procedureName, params) => {
  const connection = await getConnection();

  const paramsNames = Object.keys(params);
  const firstParam = paramsNames.shift();

  const paramsString = paramsNames.reduce(
    (previousValue, currentValue) =>
      previousValue + `,${currentValue} => :${currentValue}`,
    `${firstParam} => :${firstParam}`
  );

  const sql = `begin ${procedureName}(${paramsString}); end;`;

  const binds = Object.assign({}, params);

  const result = await connection.execute(sql, binds, options);

  return result.outBinds;
};

export const executeStoredProcedureWithLobs = async (procedureName, params) => {
  const lobParams = Object.values(params).filter(
    (param) => param.type === oracledb.CLOB
  );

  lobParams.forEach(async (param) => {
    param.val = await createCLOB(connection, param.val);
  });

  lobParams.forEach((param) => {
    param.val.destroy();
  });

  return executeStoredProcedure(procedureName, params)
};

const createCLOB = async (connection, readableStream) => {
  const CLOB = await connection.createLob(oracledb.CLOB);

  readableStream.pipe(CLOB);

  return CLOB;
};
