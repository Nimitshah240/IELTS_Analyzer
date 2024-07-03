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

app.post('/logindata', (req, res) => {

    const receivedData = req.body;
    let query = 'SELECT * FROM user WHERE id = ' + receivedData.user_id;
    let res_len;

    connection.execute(query, (error, results, fields) => {
        if (error) {
            console.error(error);
        } else {
            res_len = results.length
        }
        if (res_len == 1) {
            query = 'UPDATE user SET ll_date = ? WHERE id = ?';
            connection.execute(query, [receivedData.ll_date, receivedData.user_id], (error, results, fields) => {
                if (error) {
                    console.error(error);
                } else {
                    res.json(receivedData);
                }
            });
        } else {
            query = 'INSERT INTO user (id, name, email,location, fl_date, ll_date, picture) VALUES (\'' + receivedData.user_id + '\',\'' + receivedData.name + '\',\'' + receivedData.email + '\',\'' + receivedData.location + '\', \'' + receivedData.fl_date + '\',\'' + receivedData.ll_date + '\',\'' + receivedData.picture + '\')';
            connection.execute(query, (error, results, fields) => {
                if (error) {
                    console.error(error);
                } else {
                    res.json(receivedData);
                }
            });
        }
    });
});

app.post('/examdata', (req, res) => {

    const receivedData = req.body;
    let exam_id = [];
    let res_data = {};
    let query = 'SELECT * FROM exam WHERE user_id = ' + receivedData.user_id;
    connection.execute(query, (error, results, fields) => {
        if (error) {
            console.error(error);
        } else {
            results.forEach(element => {
                exam_id.push(element.id);
            });
            res_data.exam = results
            query = `  SELECT * FROM question WHERE exam_id IN (${exam_id.join(', ')});`;

            connection.execute(query, (error, results, fields) => {
                if (error) {
                    console.error(error);
                } else {
                    res_data.question = results;
                    res.json(res_data);
                }
            });
        }
    });
});

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);
});
