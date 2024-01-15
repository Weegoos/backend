const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { format } = require('date-fns');
const path = require('path');

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
  const userInput = req.body.userInput;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const registrationDate = format(new Date(), 'yyyy-MM-dd');

  try {
    // Проверка наличия пользователя в базе
    const existingUser = await pool.promise().query('SELECT * FROM users WHERE username = ?', [userInput]);

    if (existingUser[0].length > 0) {
      res.send('Пользователь уже существует');
    } else {
      // Проверка соответствия паролей
      if (userInput !== "" && password.length >= 8 && password === confirm_password) {
        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Вставка нового пользователя в базу данных с хэшированным паролем
        pool.query(
          'INSERT INTO users (username, password, reg_date) VALUES (?, ?, ?)',
          [userInput, hashedPassword, registrationDate],
          (error, results) => {
            if (error) {
              console.error('Error executing INSERT query:', error);
              res.status(500).send('Internal Server Error');
            } else {
              res.sendFile(path.resolve(__dirname, '..', 'message', 'message.html'));
            }
          }
        );
      } else {
        // Обработка ошибок валидации
        if (userInput.length <= 0) {
          res.send('Вы должны заполнить поле "Имя"');
        } else if (password.length < 8) {
          res.send('Пароль должен состоять из 8 символов!');
        } else if (password !== confirm_password) {
          res.send('Пароли не совпадают!');
        }
      }
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
