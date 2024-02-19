const mysql = require('mysql');

const connection = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',
    database: 'care',
    user: 'root',
    password: '',
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Server connect Sucessfully")
})




module.exports = connection;

