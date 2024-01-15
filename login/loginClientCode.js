new Vue({
    el:".container",
    data: {
        message: '',
        userName: '',
        label: "",
        answer: 'Напишите что-нибудь...'
    },
    mounted() {
        fetch('/api/data')
            .then(response => response.json())
            .then(data => {
                this.message = data.message
            })
            .catch(err => {
                console.error("Error");
            })
    },
    watch: {
        label: function (newInfo, old){
            this.answer = "Пользователь печатает..."
        }
    },
    methods: {
        saveUserName: function (){
            localStorage.setItem('userName', this.userName)
            this.seen = true
            fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
            },
                body: JSON.stringify({ userName }),
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
        },
        handleKeyDown: function (){
            switch (this.label.length) {
                case 0:
                    this.answer = ""
                    break;
            
                default:
                    break;
            }
        }
    }
})