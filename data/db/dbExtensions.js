import oracledb from "oracledb";
import ResultSet from "oracledb/lib/resultset.js";
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

  const procedureResult = await connection.execute(sql, binds, options);

  const result = {};

  for (const [key, outBind] of Object.entries(procedureResult.outBinds)) {
    if (outBind instanceof ResultSet) {
      result[key] = await outBind.getRows();
      await outBind.close();
    } else result[key] = outBind;
  }

  connection.close();

  return result;
};
