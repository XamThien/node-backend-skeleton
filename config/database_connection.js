const mysql = require('mysql2');
const const_env = require('./const_env')

let database_info = {
  host: const_env.mysql_host, 
  user: const_env.mysql_user,
  password: const_env.mysql_password,
  database: const_env.database_name,
  multipleStatements: true,
  supportBigNumbers: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}


// // xử lý call back với await
const pool = mysql.createPool(database_info);
const mySql_connection = pool.promise();


// // without caching
module.exports = mySql_connection;

