const express = require('express');
const { createPool } = require('mysql2');
const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'newpassword',
    database: 'ielts_analyser',
    connectionLimit: 10
})
const app = express();
const port = process.env.PORT || 3300;

pool.query(`select * from user`, (err, result, fields) =>{
    if (err) {
        return console.log(err);
    }
    return console.log(result);
})

// Create connection to MySQL
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root@localhost',
//     password: '',
//     database: 'ielts_analyser'
// });

// Connect to MySQL
// db.connect(function (err) {
//     if (err) {
//         // throw err;
//         console.log(err);
//         console.log('MySQL not Connected...');

//     }
//     // console.log('MySQL Connected...');
// });

// Middleware to parse JSON
// app.use(express.json());



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
