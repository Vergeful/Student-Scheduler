const mysql = require('mysql');
const util = require('util');

const db = mysql.createPool({
  host: "student-scheduler.cyezik8lqkhe.us-east-2.rds.amazonaws.com", 
  user: "admin", 
  password: "CantTouchThis123", 
  database: "DB", 
  port: 3306,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
});

// Promisify for Node.js async/await.
db.getConnection = util.promisify(db.getConnection);
db.query = util.promisify(db.query);

async function testConnection() {
  let connection;
  try {
      connection = await db.getConnection();
      const results = await connection.query('SELECT NOW() as currentTime;');
      console.log(results); // This should log the current time if the connection is successful
  } catch (error) {
      console.error('Error connecting to the database:', error);
  } finally {
      if (connection) connection.release();
  }
}

// Call the test function
testConnection();

module.exports = { db, testConnection };

