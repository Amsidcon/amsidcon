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

// Load quiz questions from GitHub
fetch(questionURL)
  .then(response => response.json())
  .then(data => {
    questions = data.sort(() => 0.5 - Math.random()); // Shuffle
    console.log("Questions loaded:", questions);
  })
  .catch(error => {
    console.error("Error loading questions:", error);
    alert("Failed to load quiz questions.");
  });

// Registration form submission with duplicate check
form.addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const hospital = document.getElementById('hospital')?.value || "";

  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbyGuNrElsDESk0LCeeSLWI5CEx_QrkJq7aFEEbUNvPJYOZ7zSHWfxuNJdisuaHd-J8L/exec');
    const data = await res.json();

    const exists = data.some(entry =>
      entry.email?.toLowerCase() === email.toLowerCase() ||
      entry.phone === phone
    );

    if (exists) {
      alert("❗ You have already submitted using this Email or Phone Number.");
      return;
    }

    // Allow to start game if no duplicate
    registrationScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    startTimer();
    waitAndLoadQuestions();

  } catch (err) {
    console.warn("⚠️ Duplicate check failed. Proceeding anyway.", err);
    registrationScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    startTimer();
    waitAndLoadQuestions();
  }
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
    return `<button class="opt-btn">${questionObj['Option ' + letter]}</button>`;
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
        card.style.backgroundColor = '#b3ffcc'; // green
      } else {
        card.style.backgroundColor = '#ff9999'; // red
      }

      totalAttempted++;
      card.onclick = null;
      document.body.removeChild(modal);
    };
  });
}

submitBtn.onclick = submitQuiz;

function submitQuiz() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const hospital = document.getElementById('hospital')?.value || "";

  fetch('https://script.google.com/macros/s/AKfycbyGuNrElsDESk0LCeeSLWI5CEx_QrkJq7aFEEbUNvPJYOZ7zSHWfxuNJdisuaHd-J8L/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name, email, phone, hospital,
      score,
      totalAttempted,
      correct: score,
      wrong: totalAttempted - score,
      timestamp: new Date().toLocaleString()
    })
  });

  alert(`✅ Submitted! Your Score: ${score}/${totalAttempted}`);
  window.location.reload();
}
