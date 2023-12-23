const {getDotEnv} = require("./Utils")
var mysql = require('sync-mysql');

let env = getDotEnv()
let options = {
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_SCHEMA
}

// console.log("DB options: ", options);

let dbConnection = new mysql(options);

module.exports = dbConnection