const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_TEST_CONN_URL,
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
          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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

const alterUsersTable = () => {
  const queryText = `ALTER TABLE users 
  ADD PRIMARY KEY ("id");`;
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

const deleteTestUser = () => {
  const queryText = `DELETE FROM users 
 WHERE jobRole = 'RegTester'`;
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
 * Create Articles tables
 */
const createArticlesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
        articles(
          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          ownerId INT NOT NULL,
          title VARCHAR(128) NOT NULL,
          article VARCHAR(128) NOT NULL,
          tag VARCHAR(128) DEFAULT 'general',
          flags INT DEFAULT 0,
          created_date TIMESTAMP DEFAULT current_timestamp,
          modified_date TIMESTAMP DEFAULT current_timestamp,
          FOREIGN KEY (ownerId) REFERENCES users (id) ON DELETE CASCADE
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
 * Drop articles table
 */
const dropArticlesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS articles';
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
 * Create Articles Comments table
 */
const createArticlesCommentsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
        articles_comments(
          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          articleId INT NOT NULL,
          ownerId INT NOT NULL,
          comment VARCHAR(128) NOT NULL,
          flags INT DEFAULT 0,
          created_date TIMESTAMP DEFAULT current_timestamp,
          modified_date TIMESTAMP DEFAULT current_timestamp,
          FOREIGN KEY (articleId) REFERENCES articles (id) ON DELETE CASCADE,
          FOREIGN KEY (ownerId) REFERENCES users (id) ON DELETE CASCADE
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
 * Drop comments table
 */
const dropArticlesCommentsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS articles_comments';
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
 * Create Articles tables
 */
const createGifsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
        gifs(
          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          ownerId INT NOT NULL,
          title VARCHAR(128) NOT NULL,
          imageUrl VARCHAR(128) NOT NULL,
          flags INT DEFAULT 0,
          created_date TIMESTAMP DEFAULT current_timestamp,
          modified_date TIMESTAMP DEFAULT current_timestamp,
          FOREIGN KEY (ownerId) REFERENCES users (id) ON DELETE CASCADE
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
 * Drop articles table
 */
const dropGifsTable = () => {
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
/**
 * Create Articles Comments table
 */
const createGifsCommentsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
        gifs_comments(
          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          gifId INT NOT NULL,
          ownerId INT NOT NULL,
          comment VARCHAR(128) NOT NULL,
          flags INT DEFAULT 0,
          created_date TIMESTAMP DEFAULT current_timestamp,
          modified_date TIMESTAMP DEFAULT current_timestamp,
          FOREIGN KEY (gifId) REFERENCES gifs (id) ON DELETE CASCADE,
          FOREIGN KEY (ownerId) REFERENCES users (id) ON DELETE CASCADE
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
 * Drop comments table
 */
const dropGifsCommentsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS gifs_comments';
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
pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

/**
 * Create All Tables
 */
const createAllTables = () => {
  createUsersTable();
  createArticlesTable();
  createArticlesCommentsTable();
  createGifsTable();
  createGifsCommentsTable();
};

/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropUsersTable();
  dropArticlesTable();
  dropArticlesCommentsTable();
  dropGifsTable();
  dropGifsCommentsTable();
};

module.exports = {
  createUsersTable,
  dropUsersTable,
  createArticlesTable,
  dropArticlesTable,
  alterUsersTable,
  createArticlesCommentsTable,
  dropArticlesCommentsTable,
  createGifsTable,
  dropGifsTable,
  createGifsCommentsTable,
  dropGifsCommentsTable,
  createAllTables,
  dropAllTables,
  deleteTestUser,
};

require('make-runnable');
