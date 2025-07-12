let questions = [];
let score = 0, totalAttempted = 0;
let timeLeft = 600;

const questionURL = "https://raw.githubusercontent.com/Amsidcon/amsidcon/main/questions.json";
const form = document.getElementById('registration-form');
const registrationScreen = document.getElementById('registration-screen');
const quizScreen = document.getElementById('quiz-screen');
const quizBoard = document.getElementById('quiz-board');
const submitBtn = document.getElementById('submit-btn');
const timerDisplay = document.getElementById('time');

// Load questions
fetch(questionURL)
  .then(response => response.json())
  .then(data => {
    questions = data.sort(() => 0.5 - Math.random());
    console.log("Questions loaded:", questions);
  })
  .catch(error => {
    console.error("Error loading questions:", error);
    alert("Failed to load quiz questions.");
  });

form.addEventListener('submit', e => {
  e.preventDefault();
  registrationScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  startTimer();
  waitAndLoadQuestions();
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

function waitAndLoadQuestions() {
  if (!questions.length) return setTimeout(waitAndLoadQuestions, 100);
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
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.background = '#fff';
  modal.style.padding = '20px';
  modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

  const options = ['A', 'B', 'C', 'D'].map(letter => {
    return `<button class="opt-btn"> ${questionObj['Option ' + letter]} </button>`;
  }).join('');

  modal.innerHTML = `
    <p><strong>${questionObj.question}</strong></p>
    ${options}
  `;
  document.body.appendChild(modal);

  document.querySelectorAll('.opt-btn').forEach(btn => {
    btn.onclick = () => {
      const selected = btn.textContent.trim();
      const correct = questionObj['Option ' + questionObj.correctAnswer].trim();
      const isCorrect = selected === correct;

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
  const hospital = document.getElementById('hospital')?.value || "";

  const payload = {
    name, email, phone, hospital,
    score, totalAttempted,
    correct: score,
    wrong: totalAttempted - score,
    timestamp: new Date().toLocaleString()
  };

  fetch('https://script.google.com/macros/s/AKfycbws9z_jHbmh9VtWDZNOs4475mPjMBfgluC8fAAtUCZzW3H9amGbdVRAFbdDPrxETwO4/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(response => response.text())
  .then(text => {
    if (text.includes("Duplicate entry")) {
      alert("You have already submitted the quiz using this email or phone number.");
    } else {
      alert(`Submitted! Score: ${score}/${totalAttempted}`);
      window.location.reload();
    }
  })
  .catch(() => {
    alert(`Submitted! Score: ${score}/${totalAttempted}`);
    window.location.reload();
  });
}
