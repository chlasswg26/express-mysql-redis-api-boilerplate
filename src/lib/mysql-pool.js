const mysql = require('mysql');
const bluebird = require('bluebird');

let mysqlPool;
// connect over unix socket in production to reduce tcp connection overhead
if (process.env.NODE_ENV === 'production') {
  mysqlPool = mysql.createPool({
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 3,
    socketPath: process.env.MYSQL_SOCKETPATH,
    user: process.env.DB_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    /* cooerce TINYINT to Boolean */
    typeCast: function(field, next) {
      if (field.type == 'TINY' && field.length == 1) {
        return field.string() == '1'; // 1 = true, 0 = false
      }
      return next();
    },
  });
} else if (process.env.NODE_ENV === 'test') {
  // allow multi-statements in a test environment only
  mysqlPool = mysql.createPool({
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 3,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || 'password123',
    database: process.env.MYSQL_NAME,
    multipleStatements: true,
    charset: 'utf8mb4',
    /* cooerce TINYINT to Boolean */
    typeCast: function(field, next) {
      if (field.type == 'TINY' && field.length == 1) {
        return field.string() == '1'; // 1 = true, 0 = false
      }
      return next();
    },
  });
} else {
  mysqlPool = mysql.createPool({
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 3,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || 'password123',
    database: process.env.MYSQL_NAME,
    charset: 'utf8mb4',
    /* cooerce TINYINT to Boolean */
    typeCast: function(field, next) {
      if (field.type == 'TINY' && field.length == 1) {
        return field.string() == '1'; // 1 = true, 0 = false
      }
      return next();
    },
  });
}

bluebird.promisifyAll(mysqlPool);

module.exports = mysqlPool;
