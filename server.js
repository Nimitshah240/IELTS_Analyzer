// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: '', // replace with your MySQL password
    database: 'ielts_analyser', // replace with your database name
    port: 3306 // default MySQL port
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});



// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.post('/data', (req, res) => {

    const receivedData = req.body;
    // let user_id = receivedData.sub;
    let query = 'SELECT * FROM user WHERE id = ' + receivedData.sub;
    let res_len;

    console.log(query);
    connection.execute(query, (error, results, fields) => {
        if (error) {
            console.log(error);
        } else {
            console.log(results + 'res');
            res_len = results.length
        }
        console.log(results.length);
        if (res_len == 1) {
            query = 'UPDATE user SET ll_date = ? WHERE id = ?';
            connection.execute(query, [receivedData.ll_date, receivedData.sub], (error, results, fields) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json(receivedData);
                }
            });
        } else {
            query = 'INSERT INTO user (id, name, email,location, fl_date, ll_date) VALUES (\'' + receivedData.sub + '\',\'' + receivedData.name + '\',\'' + receivedData.email + '\',\'' + receivedData.location + '\', \'' + receivedData.fl_date + '\',\'' + receivedData.ll_date + '\')';
            connection.execute(query, (error, results, fields) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json(receivedData);
                }
            });
        }
    });
});

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);
});
