import oracledb from "oracledb";

try {
  oracledb.initOracleClient({ libDir: "D:\\instantclient_21_3" });
} catch (err) {
  console.error("Whoops!");
  console.error(err);
  process.exit(1);
}

const dbConfig = {
  user: "FA_USER",
  password: "FA_USER",
  connectString: "WIN-0U250SFBS5D/FilmsAbout",
  poolAlias: "FA_POOL",
};

export const options = {
  outFormat: oracledb.OUT_FORMAT_OBJECT,
};

await oracledb.createPool(dbConfig);
oracledb.fetchAsString = [oracledb.CLOB];

export const getConnection = async () => {
  const connection = await oracledb.getConnection("FA_POOL");
  return connection;
};

const dbConnection = {
  getConnection,
  options,
};

export default dbConnection;
