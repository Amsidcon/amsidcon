const form = document.getElementById('registration-form');
const registrationScreen = document.getElementById('registration-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const quizBoard = document.getElementById('quiz-board');
const submitBtn = document.getElementById('submit-btn');
const timerDisplay = document.getElementById('time');
const resultText = document.getElementById('result-text');

let timeLeft = 600;
let score = 0, totalAttempted = 0;
let userInfo = {}, startTime, endTime;

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby4NMmB884evgntTBRZkHu6LmgN4RtnCIqGk5Z9eoH4ydt1lPJxis6juX_JXhu5-z8L/exec';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  userInfo.name = document.getElementById('name').value.trim();
  userInfo.email = document.getElementById('email').value.trim();
  userInfo.phone = document.getElementById('phone').value.trim();
  userInfo.hospital = document.getElementById('hospital').value.trim();

  const formData = new FormData();
  formData.append("name", userInfo.name);
  formData.append("email", userInfo.email);
  formData.append("phone", userInfo.phone);
  formData.append("hospital", userInfo.hospital);

  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    body: formData
  });

  const text = await response.text();
  console.log("Google Apps Script response:", text); // ✅ LOG FOR DEBUGGING

  if (!text.includes("Registration successful")) {
    alert("⚠️ You have already attempted the quiz with this Email or Phone number.");
    return;
  }

  registrationScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  startTime = new Date();
  startTimer();
  loadQuestions();
});

function startTimer() {
  const interval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 60) document.getElementById('timer').classList.add('red');
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
    if (timeLeft <= 0) {
      clearInterval(interval);
      submitQuiz();
    }
  }, 1000);
}

function loadQuestions() {
  fetch('questions.json')
    .then(res => res.json())
    .then(data => {
      const shuffled = shuffleArray(data).slice(0, 50);
      shuffled.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<strong>Q${index + 1}</strong>`;
        card.onclick = () => showQuestionModal(q, card);
        quizBoard.appendChild(card);
      });
    });
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function showQuestionModal(questionObj, card) {
  const options = Object.entries(questionObj)
    .filter(([key]) => key.startsWith("Option"))
    .map(([_, value]) => value);
  const correct = questionObj[`Option ${questionObj.correctAnswer}`];
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `<p><strong>${questionObj.question}</strong></p>
    ${options.map(opt => `<button class="opt-btn">${opt}</button>`).join('')}`;
  document.body.appendChild(modal);
  document.querySelectorAll('.opt-btn').forEach(btn => {
    btn.onclick = () => {
      if (btn.textContent === correct) {
        score++;
        card.style.backgroundColor = '#b3ffcc';
      } else {
        card.style.backgroundColor = '#ff9999';
      }
      totalAttempted++;
      card.style.pointerEvents = 'none';
      document.body.removeChild(modal);
    };
  });
}

submitBtn.onclick = () => {
  if (totalAttempted === 0) {
    alert('Please answer at least one question.');
    return;
  }
  submitQuiz();
};

function submitQuiz() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  endTime = new Date();
  const timeTakenSec = Math.floor((endTime - startTime) / 1000);
  const timeTakenStr = `${Math.floor(timeTakenSec / 60)}m ${timeTakenSec % 60}s`;

  const quizFormData = new FormData();
  quizFormData.append("name", userInfo.name);
  quizFormData.append("email", userInfo.email);
  quizFormData.append("phone", userInfo.phone);
  quizFormData.append("totalAttempted", totalAttempted);
  quizFormData.append("correct", score);
  quizFormData.append("wrong", totalAttempted - score);
  quizFormData.append("timeTaken", timeTakenStr);
  quizFormData.append("timestamp", new Date().toLocaleString());

  fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    body: quizFormData
  });

  resultText.textContent = `🎯 You answered ${totalAttempted} questions.\n✅ Correct: ${score} | ❌ Wrong: ${totalAttempted - score}\n⏱ Time Taken: ${timeTakenStr}`;
}
