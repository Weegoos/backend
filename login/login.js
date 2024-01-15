const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'backend',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

router.post('/message', async (req, res) => {
  const { userInput, password } = req.body;

  try {
    // Получение пользователя из базы данных
    const sql = 'SELECT * FROM users WHERE username = ?';
    pool.query(sql, [userInput], async (err, rows) => {
      if (err) {
        console.error('Error executing SELECT query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (rows.length > 0) {
        const storedHashedPassword = rows[0].password;
        
        // Сравнение введенного пароля с хэшированным паролем в базе данных
        const passwordMatch = await bcrypt.compare(password, storedHashedPassword);
        console.log(password, storedHashedPassword);
        console.log(passwordMatch);
        if (passwordMatch) {
          res.redirect('/chat');
        } else {
          res.send('Неверное имя пользователя или пароль');
        }
      } else {
        res.send('Неверное имя пользователя или пароль');
      }
    });
  } catch (error) {
    console.error('Error during execution:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
