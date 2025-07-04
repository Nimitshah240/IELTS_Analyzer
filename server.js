// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'v8i.h.filess.io',
    user: 'ieltsanalyser_reasongome', // replace with your MySQL username
    password: '1b5a8aff5a0f26a15d897aa535b295bb4a55883d', // replace with your MySQL password
    database: 'ieltsanalyser_reasongome', // replace with your database name
    port: 3306 // default MySQL port

    // host: 'localhost',
    // user: 'root', // replace with your MySQL username
    // // password: 'root', // replace with your MySQL password
    // database: 'ielts_analyser', // replace with your database name
    // port: 3306 // default MySQL port

    // host: 'sql.freedb.tech',
    // user: 'freedb_nimitshah240@', // replace with your MySQL username
    // password: 'd%#cs&?cDvzy*9W', // replace with your MySQL password
    // database: 'freedb_portfoliowebsite', // replace with your database name
    // port: process.env.DB_PORT || 3306 // default MySQL port
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
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors({
    origin: 'https://ieltsanalyzer.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));



app.get('/api/checkUser', (req, res) => {
    const user_id = req.query.user_id;
    let query = `SELECT * FROM user WHERE id = ${user_id}`;

    connection.execute(query, (error, results, fields) => {
        if (error) {
            console.error(error);
        } else {
            res.json(results);
        }
    });
});

app.post('/api/updateUserData', (req, res) => {
    const receivedData = req.body;
    console.log(receivedData);
    console.log("stringify");
    console.log(JSON.stringify(receivedData));

    if (receivedData.new == true) {
        query = ` INSERT INTO user(id, name, lastname, number, type, privacy,email,location, fl_date, picture) VALUES ('${receivedData.user_id}','${receivedData.firstname}','${receivedData.lastname}','${receivedData.number}','${receivedData.type}','${receivedData.privacy}','${receivedData.email}','${receivedData.location}','${receivedData.fl_date}','${receivedData.picture}')`;
    } else {
        query = `UPDATE user SET name = '${receivedData.firstname}', lastname = '${receivedData.lastname}', number = '${receivedData.number}', type = '${receivedData.type}', privacy = '${receivedData.privacy}', email = '${receivedData.email}', location = '${receivedData.location}', fl_date = '${receivedData.fl_date}', picture = '${receivedData.picture}' WHERE id = ${receivedData.user_id}`;
    }
    connection.execute(query, (error, results, fields) => {
        if (error) {
            console.error(error);
        } else {
            res.json(receivedData);
        }
    });
});

app.get('/api/examdata', (req, res) => {
    const user_id = req.query.user_id;
    const module = [];
    if (req.query.module == 'undefined') {
        module.push('\'Reading\'');
        module.push('\'Listening\'');
    } else {
        module.push('\'' + req.query.module + '\'');
    }

    let query = `SELECT exam.*, question.* FROM exam LEFT JOIN question ON question.exam_id = exam.id WHERE exam.user_id = ${user_id} AND module IN (${module.join(', ')}) ORDER BY exam.date ASC`;

    connection.execute(query, (error, results, fields) => {
        if (error) {
            console.error(error);
        } else {
            res.json(results);
        }
    });
});

app.delete('/api/deleteExam', (req, res) => {
    const exam_id = req.query.exam_id;
    let query = "DELETE FROM exam WHERE id = ?";

    connection.execute(query, [exam_id], (error, results, fields) => {
        if (error) {
            console.error(error);
        } else {
            query = "DELETE FROM question WHERE exam_id = ?";
            connection.execute(query, [exam_id], (error, results, fields) => {
                if (error) {
                    console.error(error);
                } else {
                    res.json(results)
                }
            });
        }
    });
});

app.post('/api/insertExam', (req, res) => {

    let exam_id = req.headers.exam_id;
    const receivedData = req.body;

    console.log(receivedData);
    console.log("stringify");
    console.log(JSON.stringify(receivedData));

    let exam_query;

    if (exam_id != '') {
        exam_query = `UPDATE exam SET exam_name = '${receivedData[0].exam_name}', date = '${receivedData[0].date}', band = ${receivedData[0].band} WHERE id = ${exam_id}`
        connection.execute(exam_query, (error, results) => {
            if (error) console.error(error);
            questioninsert(receivedData, exam_id);
            res.json(receivedData);
        });
    } else {
        exam_query = `INSERT INTO exam (user_id, exam_name, date, module, band) VALUES ('${receivedData[0].user_id}', '${receivedData[0].exam_name}', '${receivedData[0].date}', '${receivedData[0].module}', ${receivedData[0].band}) `;
        connection.execute(exam_query, (error, results) => {
            if (error) console.error(error);
            exam_id = results.insertId;
            questioninsert(receivedData, exam_id);
            res.json(receivedData);
        });
    }
});

function questioninsert(receivedData, exam_id) {
    let query;
    let values = [];
    let check = false;
    const queryBase = 'INSERT INTO question (user_id, exam_id, question_type, correct, incorrect, miss, total, section) VALUES ';

    receivedData.forEach(element => {
        if (JSON.stringify(element.id).includes("temp")) {
            check = true;
            values.push(`(${element.user_id}, ${exam_id}, '${element.question_type}', ${element.correct}, ${element.incorrect}, ${element.miss}, ${element.total}, ${element.section})`);
        }
    });
    query = queryBase + values.join(', ');
    if (check) {
        connection.execute(query, (error, results, fields) => {
            if (error) console.error(error);
        });
    }
}

app.delete('/api/deleteQuestion', (req, res) => {
    const question_id = req.query.question_id;
    let query = "DELETE FROM question WHERE id = ?";

    connection.execute(query, [question_id], (error, results, fields) => {
        if (error) {
            console.error(error);
        }
    });
    res.json(question_id);
});

app.get('/api/studentdata', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    // Currently static but later must create Table of this such user
    if (username == 'Nimit' && password == "Shah") {
        // Currently static but later must create Table of this such user
        let query = `SELECT user.*, COUNT(CASE WHEN exam.module = 'listening' THEN 1 END) AS listening_count,
                COUNT(CASE WHEN exam.module = 'reading' THEN 1 END) AS reading_count FROM user 
                LEFT JOIN exam ON user.id = exam.user_id GROUP BY user.id`;

        connection.execute(query, (error, results, fields) => {

            if (error) {
                console.error(error);
            } else {
                res.json(results);
            }
        });
    } else {
        res.json('Invalid User');
    }
});

app.post('/api/feedback', (req, res) => {
    const receivedData = req.body;
    const user_id = receivedData.user_id;
    const name = receivedData.name;
    const email = receivedData.email;
    const message = receivedData.message;
    let query = `INSERT INTO feedback (user_id, name, email, message) VALUES ('${user_id}', '${name}','${email}', '${message}');`;
    connection.execute(query, (error, results, fields) => {
        if (error) {
            console.error(error);
        } else {
            res.json(results);
        }
    });
});


app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);
});