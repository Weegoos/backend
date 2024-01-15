// JavaScript (Vue.js)
new Vue({
    el: '.container',
    data: {
      server: '',
      isServerWork: false,
      label: '',
      answer: "",
      userData: {},
    },
    mounted: function () {
      // Fetch data from API
      fetch('/api/data')
        .then(response => response.json())
        .then(data => {
          this.server = data.message;
        })
        .catch(error => {
          console.log("Error:", error);
        });
  
      // Fetch user data from bot.json
      fetch('./bot.json') 
        .then(response => response.json())
        .then(data => {
          this.userData = data;
        })
        .catch(error => {
          console.log("Error:", error);
        });
  
      // Setup keydown event listener for textarea
      this.setupEnterKeyListener();
    },
    methods: {
      handleKeyUpUserInput: function () {
        switch (this.label) {
          case "":
            this.answer = "";
            break;
  
          default:
            // this.answer = "Печатает...."
            break;
        }
      },
      sendMsg() {
        const text = this.label;
  
        const itemPart = document.createElement('li');
        itemPart.classList.add('list-group-item');
                
        const productName = document.createElement('p');
        productName.classList.add('chatMsg');
        productName.textContent = `${text}`;
  
        const botMsg = document.createElement('p');
        botMsg.classList.add('botMsg');
  
        const messageProcessing = new MessageProcessing();
        messageProcessing.includeMessage(text, botMsg, this.userData);
        messageProcessing.getBotMessage(text, botMsg, this.userData);
  
        itemPart.append(productName);
        itemPart.append(botMsg);
  
        document.getElementById('msg_list').append(itemPart);
        this.label = ""; // Clear the textarea
  
        // Отправка сообщения на сервер
        fetch('/chat/save-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: text }),
        })
        .then(response => response.json())
        .then(data => {
          console.log(data); // Обработка ответа, если необходимо
        })
        .catch(error => {
          console.error('Error:', error);
        });
      },
      setupEnterKeyListener() {
        const textarea = document.querySelector('textarea');
        textarea.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMsg();
          }
        });
      },
    },
  });
  
  class MessageProcessing {
    constructor() {
    }
  
    includeMessage(message, bot, user) {
      if (message.includes('настроение') || message.includes('как дела')) {
        bot.textContent = user.conversation.mood;
      } else {
        bot.textContent = user.warning.unclear;
      }
    }
  
    getBotMessage(message, bot, user) {
      switch (message) {
        case "Привет":
          bot.textContent = user.conversation.greeting;
          break;
        
        case "Расскажи о себе":
          bot.textContent = `${user.information.name} ${user.information.year}`;
          break;
  
        case "Что ты умеешь?":
          bot.textContent = `${user.information.skills}`;
          break;
  
        case "":
          bot.textContent = user.warning.emptyMessage;
          break;
  
        default:
          break;
      }
    }
  }
  