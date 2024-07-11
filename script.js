document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const startBtn = document.getElementById('start-btn');
    const loadingScreen = document.getElementById('loading-screen');
    const chatContainer = document.querySelector('.chat-container');

    // Simulate loading screen
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        chatContainer.style.display = 'flex';
    }, 3000);

    const questions = [
        { text: "Nivel 1: ¿Cuánto es 5 + 3?", answer: "8" },
        { text: "Nivel 1: ¿Cuánto es 7 - 2?", answer: "5" },
        { text: "Nivel 2: ¿Cuánto es 12 + 4?", answer: "16" },
        { text: "Nivel 2: ¿Cuánto es 9 - 3?", answer: "6" },
        { text: "Nivel 3: ¿Cuánto es 15 / 3?", answer: "5" },
        { text: "Nivel 3: ¿Cuánto es 8 * 2?", answer: "16" },
        { text: "Nivel 4: ¿Cuánto es 25 + 30?", answer: "55" },
        { text: "Nivel 4: ¿Cuánto es 50 - 20?", answer: "30" },
        { text: "Nivel 5: ¿Cuánto es 6 * 6?", answer: "36" },
        { text: "Nivel 5: ¿Cuánto es 49 / 7?", answer: "7" },
        { text: "Nivel 6: ¿Cuánto es 81 / 9?", answer: "9" },
        { text: "Nivel 6: ¿Cuánto es 14 + 10?", answer: "24" },
        { text: "Nivel 7: ¿Cuánto es 19 - 8?", answer: "11" },
        { text: "Nivel 7: ¿Cuánto es 16 / 4?", answer: "4" },
        { text: "Nivel 8: ¿Cuánto es 13 + 14?", answer: "27" },
        { text: "Nivel 8: ¿Cuánto es 22 - 7?", answer: "15" },
        { text: "Nivel 9: ¿Cuánto es 30 / 5?", answer: "6" },
        { text: "Nivel 9: ¿Cuánto es 7 * 3?", answer: "21" },
        { text: "Nivel 10: ¿Cuánto es 50 / 10?", answer: "5" },
        { text: "Nivel 10: ¿Cuánto es 40 - 15?", answer: "25" },
        { text: "Nivel 11: ¿Cuánto es 60 + 25?", answer: "85" },
        { text: "Nivel 11: ¿Cuánto es 70 - 30?", answer: "40" },
        { text: "Nivel 12: ¿Cuánto es 4 * 4?", answer: "16" },
        { text: "Nivel 12: ¿Cuánto es 81 / 9?", answer: "9" },
        { text: "Nivel 13: ¿Cuánto es 17 + 23?", answer: "40" },
        { text: "Nivel 13: ¿Cuánto es 31 - 12?", answer: "19" },
        { text: "Nivel 14: ¿Cuánto es 72 / 8?", answer: "9" },
        { text: "Nivel 14: ¿Cuánto es 8 * 8?", answer: "64" },
        { text: "Nivel 15: ¿Cuánto es 14 + 15?", answer: "29" },
        { text: "Nivel 15: ¿Cuánto es 22 - 10?", answer: "12" },
        // Agregar más preguntas aquí para completar 30 niveles
    ];

    let currentLevel = 1;
    let questionIndex = 0;

    function appendMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        
        const textElement = document.createElement('div');
        textElement.classList.add('text');
        textElement.textContent = text;
        
        messageElement.appendChild(textElement);

        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;

        if (sender === 'bot') {
            speakText(text);
        }
    }

    function askNextQuestion() {
        if (questionIndex < questions.length) {
            const currentQuestion = questions[questionIndex];
            appendMessage('bot', currentQuestion.text);
        } else {
            appendMessage('bot', "¡Felicidades, has completado todos los ejercicios!");
            speakText("¡Felicidades, has completado todos los ejercicios!");
        }
    }

    function checkAnswer(userAnswer) {
        const currentQuestion = questions[questionIndex];
        if (parseFloat(userAnswer) === parseFloat(currentQuestion.answer)) {
            appendMessage('bot', '¡Correcto!');
            speakText('¡Correcto!');
            questionIndex++;
            setTimeout(askNextQuestion, 2000);
        } else {
            appendMessage('bot', 'Incorrecto, intenta de nuevo.');
        }
    }

    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        speechSynthesis.speak(utterance);
    }

    function startRecognition() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'es-ES';
        recognition.start();

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            appendMessage('user', speechResult);
            checkAnswer(speechResult.trim());
        };

        recognition.onerror = (event) => {
            handleRecognitionError(event.error);
        };

        recognition.onspeechend = () => {
            recognition.stop();
        };
    }

    function handleRecognitionError(error) {
        let errorMessage;
        switch(error) {
            case 'no-speech':
                // No se muestra ningún mensaje
                break;
            case 'audio-capture':
                errorMessage = 'No se pudo acceder al micrófono. Asegúrate de que tu micrófono esté conectado y habilitado.';
                appendMessage('bot', errorMessage);
                break;
            case 'not-allowed':
                errorMessage = 'Permiso de micrófono denegado. Por favor, permite el acceso al micrófono y recarga la página.';
                appendMessage('bot', errorMessage);
                break;
            default:
                errorMessage = 'Error al reconocer la voz: ' + error;
                appendMessage('bot', errorMessage);
                break;
        }
    }

    sendBtn.addEventListener('click', () => {
        const userText = userInput.value;
        if (userText.trim() !== "") {
            appendMessage('user', userText);
            checkAnswer(userText);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const userText = userInput.value;
            if (userText.trim() !== "") {
                appendMessage('user', userText);
                checkAnswer(userText);
                userInput.value = '';
            }
        }
    });

    startBtn.addEventListener('click', () => {
        appendMessage('bot', "Hola, soy tu PROFESOR de matemática. Te haré algunas preguntas para ayudarte a practicar.");
        questionIndex = 0; // Reinicia el índice de preguntas al iniciar
        askNextQuestion();
        startRecognition();
    });
});
