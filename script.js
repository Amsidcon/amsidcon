let questions = [];

fetch('./questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data.sort(() => 0.5 - Math.random()); // Shuffle questions
    console.log("Questions loaded:", questions);
  })
  .catch(error => {
    console.error('Failed to load questions:', error);
    alert("Failed to load quiz questions.");
  });

let score = 0, totalAttempted = 0;
let timeLeft = 600;
const form = document.getElementById('registration-form');
const registrationScreen = document.getElementById('registration-screen');
const quizScreen = document.getElementById('quiz-screen');
const quizBoard = document.getElementById('quiz-board');
const submitBtn = document.getElementById('submit-btn');
let timerDisplay = document.getElementById('time');

form.addEventListener('submit', e => {
  e.preventDefault();
  registrationScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  startTimer();
  loadQuestions();
});

function startTimer() {
  const interval = setInterval(() => {
    timeLeft--;
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
  if (!questions.length) return setTimeout(loadQuestions, 100); // wait until loaded
  questions.slice(0, 50).forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>Q${index + 1}</strong>`;
    card.onclick = () => showQuestionModal(q, card);
    quizBoard.appendChild(card);
  });
}

function showQuestionModal(questionObj, card) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.position = 'fixed';
  modal.style.top = '50%'; modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.background = '#fff';
  modal.style.padding = '20px';
  modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  modal.innerHTML = `
    <p><strong>${questionObj.question}</strong></p>
    ${questionObj.options.map(opt => `<button class="opt-btn">${opt}</button>`).join('')}
  `;
  document.body.appendChild(modal);
  document.querySelectorAll('.opt-btn').forEach(btn => {
    btn.onclick = () => {
      const isCorrect = btn.textContent === questionObj.answer;
      if (isCorrect) {
        score++;
        card.style.backgroundColor = '#b3ffcc';
      } else {
        card.style.backgroundColor = '#ff9999';
      }
      totalAttempted++;
      card.onclick = null;
      document.body.removeChild(modal);
    };
  });
}

submitBtn.onclick = submitQuiz;

function submitQuiz() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  fetch('https://script.google.com/macros/s/AKfycbyGuNrElsDESk0LCeeSLWI5CEx_QrkJq7aFEEbUNvPJYOZ7zSHWfxuNJdisuaHd-J8L/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name, email, phone,
      score, totalAttempted,
      correct: score,
      wrong: totalAttempted - score,
      timestamp: new Date().toLocaleString()
    })
  });
  alert(`Submitted! Score: ${score}/${totalAttempted}`);
  window.location.reload();
};
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
      const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 50);
      shuffled.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<strong>Q${index + 1}</strong>`;
        card.onclick = () => showQuestionModal(q, card);
        quizBoard.appendChild(card);
      });
    });
}

function showQuestionModal(questionObj, card) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.position = 'fixed';
  modal.style.top = '50%'; modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.background = '#fff';
  modal.style.padding = '20px';
  modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  modal.innerHTML = `
    <p><strong>${questionObj.question}</strong></p>
    ${questionObj.options.map(opt => `<button class="opt-btn">${opt}</button>`).join('')}
  `;
  document.body.appendChild(modal);
  document.querySelectorAll('.opt-btn').forEach(btn => {
    btn.onclick = () => {
      const isCorrect = btn.textContent === questionObj.answer;
      if (isCorrect) {
        score++;
        card.style.backgroundColor = '#b3ffcc';
      } else {
        card.style.backgroundColor = '#ff9999';
      }
      totalAttempted++;
      document.body.removeChild(modal);
    };
  });
}

submitBtn.onclick = submitQuiz;

function submitQuiz() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  fetch('https://script.google.com/macros/s/AKfycbyGuNrElsDESk0LCeeSLWI5CEx_QrkJq7aFEEbUNvPJYOZ7zSHWfxuNJdisuaHd-J8L/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name, email, phone,
      score, totalAttempted,
      correct: score,
      wrong: totalAttempted - score,
      timestamp: new Date().toLocaleString()
    })
  });
  alert(`Submitted! Score: ${score}/${totalAttempted}`);
  window.location.reload();
}
