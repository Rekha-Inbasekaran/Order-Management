const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'test',
  database: 'blinkworx',
  port: '3306'
})

function connect_db() {
    connection.connect((err) => {
        if (err) {
            console.log("DB connection failed")
        } else {
            console.log("DB connection is successful...")
        }
    })
}

module.exports = {
    connect_db,
    connection
}