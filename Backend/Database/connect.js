const mysql = require('mysql2');
const util = require('util');

const pool = mysql.createPool({
  host: "student-scheduler.cyezik8lqkhe.us-east-2.rds.amazonaws.com", 
  user: "admin", 
  password: "CantTouchThis123", 
  database: "DB", 
  port: 3306
}).promise();

module.exports = pool;