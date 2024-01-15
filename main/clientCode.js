new Vue({
    el: '.container',
    data: {
      messageFromServer: '',
    },
    mounted() {
      fetch('/api/data')
        .then(response => response.json())
        .then(data => {
        //   console.log('Данные с сервера:', data);
          this.messageFromServer = data.message;
        })
        .catch(error => {
          console.error('Ошибка при запросе к серверу:', error);
        });
    },
    methods:{
        registrationBtn: function (){
            window.location.href = "http://localhost:3000/reg"
        },
        loginBtn: function (){
            window.location.href = "http://localhost:3000/log"
        }
    }
  });
