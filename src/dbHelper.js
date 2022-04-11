import pg from 'pg'
const { Client, Pool } =pg;
// import config from './config'

let config={
  PORT: 5000,
  dbConnection: {
    user: "postgres", 
    host: "localhost",
    password: '1234',
      port: 5432
  },

}

const {PORT, dbConnection } = config;

export function getPool(database) {
  console.log("DB :".bold.blue, database.bold.red);
  const connString = {
    user: config.dbConnection.user,
    password: config.dbConnection.password,
    host: config.dbConnection.host,
    port:config.dbConnection.port,
    database,
  };
  return new Pool(connString);
}

// async function execute(dbName) {
//     try {
//         const pool = getPool(name);
//
//         const { rows } = pool.query(`CREATE DATABASE ${dbName}`)
//         return Promise.resolve(rows)
//     } catch (err) {
//         console.error(err);
//         return Promise.reject(err)
//     }
// }

export async function updateAll(dbName, schemaName, tableName, query, param) {
  const pool = getPool(dbName);
  try {
    let itemValues = [],
      cond = [];

    const newQuer = query.toString().split(",");
    for (let [key, values] of Object.entries(newQuer)) {
      cond.push(`"${schemaName}"."${tableName}"."id"='${values}'`);
    }

    for (let [key, value] of Object.entries(param)) {
      itemValues.push(`"${key}" = '${value}'`);
    }

    let q = ` UPDATE "${schemaName}"."${tableName}"  SET ${itemValues.join(
      ","
    )}  WHERE ${cond.join(" or ")}
        RETURNING  ${schemaName}."${tableName}".*`.replace(/''/g, null);
    const { rows } = await pool.query(q);
    return Promise.resolve(rows[0]);
  } catch (err) {
    pool.end();
    console.error(err);
    return Promise.reject(err);
  }
}

 export async function execute(dbName, query) {
  const pool = getPool(dbName);
  try {
    const { rows } = await pool.query(query);
    return Promise.resolve(rows);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function executeOne(dbName, query) {
  const pool = getPool(dbName);
  try {
    const { rows } = await pool.query(query);
    return Promise.resolve(rows.length > 0 ? rows[0] : null);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function transaction(dbName, query) {
  const pool = getPool(dbName);
  try {
    await pool.query("BEGIN");
    const { rows } = await client.query(query);
    await pool.query("COMMIT");
    return Promise.resolve(rows);
  } catch (ex) {
    await pool.query("ROLLBACK");
    console.error(ex);
    return Promise.reject(ex);
  }
}

export async function findOne(dbName, schemaName, tableName, query) {
  const pool = getPool(dbName);
  try {
    let cond = [];
    for (let [key, value] of Object.entries(query)) {
      cond.push(`${schemaName}."${tableName}"."${key}" = '${value}'`);
    }
    const q = `SELECT * FROM ${schemaName}."${tableName}" WHERE ${cond.join(
      " OR "
    )}`;

    const { rows } = await pool.query(q);
    return Promise.resolve(rows.length > 0 ? rows[0] : null);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function findById(dbName, schemaName, tableName, query, returnType) {
  const pool = getPool(dbName);
  try {
    let cond = [];
    for (let [key, value] of Object.entries(query)) {
      cond.push(`${schemaName}."${tableName}"."${key}" = '${value}'`);
    }
    const q = `SELECT * FROM ${schemaName}."${tableName}" WHERE ${cond.join(
      " and "
    )}`;
    console.log("query", q);
    const { rows } = await pool.query(q);
    return Promise.resolve(
      rows.length > 0
        ? returnType == "Array"
          ? rows
          : rows[0]
        : returnType == "Array"
        ? rows
        : null
    );
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function find(dbName, schemaName, tableName) {
  const pool = getPool(dbName);
  try {
    const query = `SELECT * FROM ${schemaName}."${tableName}" `;
    const { rows } = await pool.query(query);
    return Promise.resolve(rows);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function insert(dbName, schemaName, tableName, param) {
  const pool = getPool(dbName);
  try {
    let itemKeys = Object.keys(param);
    let itemValues = [];

    itemKeys.forEach(function (item) {
      itemValues.push(param[item]);
    });

    let query = `INSERT INTO ${schemaName}."${tableName}" ("${itemKeys.join(
      '","'
    )}") VALUES ('${itemValues.join("','")}') 
                     RETURNING  ${schemaName}."${tableName}".*`.replace(
      /''/g,
      null
    );
    const { rows } = await pool.query(query);
    return Promise.resolve(rows[0]);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function insertMany(dbName, schemaName, tableName, param) {
  const pool = getPool(dbName);
  try {
    let itemKeys = Object.keys(param[0]);
    let query =
      "INSERT INTO " +
      schemaName +
      "." +
      '"' +
      tableName +
      '"' +
      " (" +
      '"' +
      itemKeys.join('","') +
      '"' +
      ") VALUES "; //( '" + itemValues.join("', '") + "' ) ";
    for (let obj of param) {
      let itemValues = [];
      itemKeys.forEach(function (item) {
        let val = obj[item];
        if (val) {
          val = val.toString();
          val = val.replace(/'/g, "''");
        }

        itemValues.push(val);
      });
      query += " ('" + itemValues.join("','") + "'),";
    }
    query = query.slice(0, -1).replace(/''/g, null);
    const { rowCount } = await pool.query(query);
    return Promise.resolve(rowCount);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function insertManyC(dbName, schemaName, tableName, param, client) {
  const pool = getPool(dbName);
  try {
    let itemKeys = Object.keys(param[0]);
    let query =
      "INSERT INTO " +
      schemaName +
      "." +
      '"' +
      tableName +
      '"' +
      " (" +
      '"' +
      itemKeys.join('","') +
      '"' +
      ") VALUES "; //( '" + itemValues.join("', '") + "' ) ";
    for (let obj of param) {
      let itemValues = [];
      itemKeys.forEach(function (item) {
        itemValues.push(obj[item]);
      });
      query += " ('" + itemValues.join("','") + "'),";
    }
    query = query.slice(0, -1);
    //console.log(query);
    //await pool.connect();
    const { rowCount } = await client.query(query);
    return Promise.resolve(rowCount);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export async function update(dbName, schemaName, tableName, query, param) {
  const pool = getPool(dbName);
  try {
    let itemValues = [],
      cond = [];

    for (let [key, value] of Object.entries(query)) {
      cond.push(`${schemaName}."${tableName}"."${key}" ='${value}'`);
    }
    for (let [key, value] of Object.entries(param)) {
      itemValues.push(`"${key}" = '${value}'`);
    }
    let q = ` UPDATE "${schemaName}"."${tableName}"  SET ${itemValues.join(
      ","
    )}  WHERE ${cond.join(" and ")}
        RETURNING  ${schemaName}."${tableName}".*`.replace(/''/g, null);
    const { rows } = await pool.query(q);
    return Promise.resolve(rows[0]);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}
export async function updateOne(dbName, schemaName, tableName, update, cond = "") {
  const pool = getPool(dbName);
  try {
    let itemValues = [];
    for (let [key, value] of Object.entries(update)) {
      if (typeof value === "number") {
        itemValues.push(`"${key}"=${value}`);
      } else if (typeof value === "string") {
        itemValues.push(`"${key}"='${value}'`);
      } else {
        itemValues.push(`"${key}"=${value}`);
      }
    }

    let q = `UPDATE ${schemaName}."${tableName}"  SET ${itemValues.join(
      ","
    )} ${cond}
                  RETURNING  ${schemaName}."${tableName}".*`.replace(
      /''/g,
      null
    );
    console.log(q, "............");
    const { rows } = await pool.query(q);
    return Promise.resolve(rows[0]);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

export const tableExist = (dbName, tableName) => {
  return new Promise((resolve, reject) => {
    const query = ` SELECT * FROM ${config.Schemas}.${tableName} `;
    //console.log(query);
    clientDb(dbName).query(query, (error, results) => {
      if (error) {
        // console.log(error)
        if (error.code == "ER_BAD_DB_ERROR") resolve(false);
        else if (error.code == "ER_NO_SUCH_TABLE") resolve(false);
      } else resolve(results);
    });
  });
};

export const createTable = (dbName, query) => {
  return new Promise((resolve, reject) => {
    //console.log(query);
    clientDb(dbName).query(query, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

