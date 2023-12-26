const { Pool } = require('pg');
const dbConfig = require('../config/database.js');

let pool;

async function initialize() {
  pool = new Pool(dbConfig.dbPool);
}

async function close() {
  await pool.end();
}


function simpleExecute(statement, binds = []) {

  return new Promise(async (resolve, reject) => {
    let conn;

    try {
      conn = await pool.connect();

      const result = await conn.query(statement, binds);

      resolve(result.rows);

    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        try {
          conn.release();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}
  
module.exports.simpleExecute = simpleExecute;
module.exports.initialize = initialize;
module.exports.close = close;
