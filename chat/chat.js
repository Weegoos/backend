const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express()
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'backend',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  db.connect((err) => {
    if (err) {
      console.error('Ошибка подключения к базе данных:', err);
    } else {
      console.log('Подключение к базе данных успешно');
    }
  });
  
  app.use(bodyParser.json());
  

  app.post('/chat/save-message', (req, res) => {
    const messageContent = req.body.message;

    if (!messageContent) {
        return res.status(400).json({ error: 'Message content is required' });
    }

    // Пример кода для взаимодействия с базой данных и сохранения сообщения
    db.query('INSERT INTO messages (content) VALUES (?)', [messageContent], (err, results) => {
        if (err) {
            console.error('Ошибка при сохранении сообщения:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Успешное сохранение
        return res.status(200).json({ success: true });
    });
});

module.exports = router;
