const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_LOCAL_CONN_URL,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create users tables
 */
const createUsersTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
        users(
          id INT GENERATED ALWAYS AS IDENTITY,
          firstName VARCHAR(128) NOT NULL,
          lastName VARCHAR(128) NOT NULL,
          email VARCHAR(128) UNIQUE NOT NULL,
          password VARCHAR(128) NOT NULL,
          gender VARCHAR(50)  NULL,
          jobRole VARCHAR(128)  NULL,
          department VARCHAR(128) NOT NULL,
          address VARCHAR(200) NULL,
          role VARCHAR(11) DEFAULT 'employee',
          created_date TIMESTAMP DEFAULT current_timestamp,
          modified_date TIMESTAMP DEFAULT current_timestamp
        )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create gifs table
 */
/*
const createGifsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS gifs (
          id UUID PRIMARY KEY,
          userId UUID NOT NULL,
          title VARCHAR(128) NOT NULL,
          image VARCHAR(128) NOT NULL,
          inappropraite INT(255) DEFAULT 0,
          created_date TIMESTAMP,
          modified_date TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
        )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};
*/
/**
 * Drop users table
 */
const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop gifs  table
 */
/*
const dropgifsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS gifs';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};
*/
pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createUsersTable,
  dropUsersTable,
};

require('make-runnable');
