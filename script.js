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
