document.addEventListener("DOMContentLoaded", () => {
  const username = prompt("Enter your name to proceed");
  if (username === null || username.trim() === "") {
    window.location.href = "index.html";
  }

  // Step 1: Get subject from URL
  const UrlPrams = new URLSearchParams(window.location.search);
  const subject = decodeURIComponent(UrlPrams.get("subject") || "").trim();
  console.log(subject);

  // Step 2: Select HTML elements
  const progress = document.getElementById("progress");
  const questionNum = document.getElementById("question-number");
  const question_text = document.getElementById("question-text");
  const ALLoptions = document.getElementById("option-container");
  const back_btn = document.getElementById("back-btn");
  const next_btn = document.getElementById("next-btn");

  // Step 3: Declare variables
  let questions = [];
  let score = 0;
  let currentQuestionNum = 0;
  let selectedOption = null;
  let answeredQuestions = 0;
  let answered = [];

  // Step 4: Load questions from questionBank
  function initializeQuiz() {
    questions = (questionBank && questionBank[subject]) || [];
    if (questions.length === 0) {
      alert("No questions found for this subject.");
      window.location.href = "index.html";
      return false;
    }

    score = 0;
    currentQuestionNum = 0;
    selectedOption = null;
    answeredQuestions = 0;
    answered = Array(questions.length).fill(false);
    progress.style.width = "0%";

    console.log("Quiz initialized for subject:", subject);
    return true;
  }

  if (!initializeQuiz()) return;

  renderQuestion();

  function renderQuestion() {
    const question = questions[currentQuestionNum];
    questionNum.textContent = `${currentQuestionNum + 1}. `;
    question_text.textContent = question.question;

    const progressPercentage =
      ((currentQuestionNum + 1) / questions.length) * 100;
    progress.style.width = `${progressPercentage}%`;

    const optionDivs = ALLoptions.querySelectorAll(".options");
    optionDivs.forEach((div, index) => {
      div.textContent = question.options[index];
      div.classList.remove("correct", "incorrect");

      const selectedAnswer = question.options[index];
      const correctAnswer = question.answer;

      if (answered[currentQuestionNum]) {
        if (selectedAnswer === correctAnswer) {
          div.classList.add("correct");
        } else if (index === selectedOption) {
          div.classList.add("incorrect");
        }
      }

      div.onclick = () => selectOption(index, div);
    });

    selectedOption = null;
    updateButtons();
  }

  function selectOption(index) {
    if (selectedOption !== null || answered[currentQuestionNum]) return;

    selectedOption = index;
    const question = questions[currentQuestionNum];
    const selectedAnswer = question.options[index];
    const correctAnswer = question.answer;

    const optionDivs = ALLoptions.querySelectorAll(".options");
    optionDivs.forEach((div, idx) => {
      div.classList.remove("correct", "incorrect");
      if (idx === index && selectedAnswer === correctAnswer) {
        div.classList.add("correct");
        score++;
      } else if (idx === index) {
        div.classList.add("incorrect");
      }
      if (question.options[idx] === correctAnswer) {
        div.classList.add("correct");
      }
    });

    answered[currentQuestionNum] = true;
    answeredQuestions = answered.filter(Boolean).length;

    next_btn.disabled = false;
    updateButtons();
  }

  function updateButtons() {
    back_btn.disabled = currentQuestionNum === 0;
    next_btn.disabled =
      selectedOption === null && !answered[currentQuestionNum];
    next_btn.textContent =
      currentQuestionNum === questions.length - 1 ? "Finish" : "Next";
  }

  function animateProgress(element, finalDegrees, duration) {
    let current = 0;
    const stepTime = 1000 / 60;
    const steps = duration / stepTime;
    const increment = finalDegrees / steps;

    const animate = () => {
      current += increment;
      if (current >= finalDegrees) {
        current = finalDegrees;
      }
      element.style.setProperty("--progress-degrees", `${current}deg`);
      element.style.opacity = element.style.opacity === "0.99" ? "1" : "0.99";
      if (current < finalDegrees) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  next_btn.addEventListener("click", () => {
    if (!answered[currentQuestionNum]) return;

    if (currentQuestionNum < questions.length - 1) {
      currentQuestionNum++;
      renderQuestion();
    } else {
      const percentage = Math.round((score / questions.length) * 100);
      setTimeout(() => {
        ALLoptions.parentElement.innerHTML = `
          <div class="result-container">
            <h2>Quiz Completed!</h2>
            <div class="circular-progress" style="--progress-degrees:0deg;">
              <div class="inner-circle">
                <span class="percentage">${percentage}%</span>
                <span class="score">You scored ${score}/${questions.length}</span>
              </div>
            </div>
            <button class="dashboard-btn" onclick="window.location.href='index.html'">Back to dashboard</button>
          </div>
        `;
        const circularProgress = document.querySelector(".circular-progress");
        animateProgress(circularProgress, percentage * 3.6, 1000);
      }, 500);
    }
  });

  back_btn.addEventListener("click", () => {
    if (currentQuestionNum > 0) {
      currentQuestionNum--;
      renderQuestion();
    }
  });
});
