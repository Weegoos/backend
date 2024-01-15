const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 

const registrationRouter = require('./registration/reg');
const loginRouter = require('./login/login');
const mainPageRouter = require('./main/mainPageScript')
const chatPageRouter = require('./chat/chat')


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, 'Backend')));
// css file
app.use('/log/css', express.static(path.resolve(__dirname, 'login', 'css')));
app.use('/reg/css', express.static(path.resolve(__dirname, 'registration', 'css')));
app.use('/main/css', express.static(path.resolve(__dirname, 'main', 'css')));
app.use('/chat/css', express.static(path.resolve(__dirname, 'chat', 'css')));


app.use('/main', express.static(path.resolve(__dirname, 'main')));

app.get('/api/data', (req, res) =>{
  const serverData = {message: "Сервер работает!"};
  res.json(serverData)
})

app.use('/', mainPageRouter)
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'main', 'index.html'))
})

app.use('/reg', registrationRouter);
app.get('/reg', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'registration', 'reg.html'));
  });

app.use('/log', loginRouter);
app.get('/log', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'login', 'login.html'));
    
  });

app.use('/login', express.static(path.resolve(__dirname, 'login')));

app.get('/chat', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'chat', 'chat.html'));
});
app.use('/chat', express.static(path.resolve(__dirname, 'chat')));

app.get('/bot.json', (req, res) => {
  res.sendFile(path.resolve(__dirname,'chat', 'bot.json'));
})

app.get('/chat/save-message', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'chat', 'chat.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
