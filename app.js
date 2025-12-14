const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'hospital_db'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database.');
});


app.get('/api/patients', (req, res) => {
    const sql = 'SELECT * FROM patients';
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results); 
    });
});


app.post('/add-patient', (req, res) => {
    const { id, age, glucose } = req.body;
    
    const sql = 'INSERT INTO patients (patient_id, age, glucose) VALUES (?, ?, ?)';
    connection.query(sql, [id, age, glucose], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }
        res.json({ success: true, message: 'Patient added successfully!' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});