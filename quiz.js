document.addEventListener("DOMContentLoaded", () => {
  // var username = prompt("Enter your name to proceed");
  // if (username === null || username.trim() === "") {
  //   window.location.href = "index.html";
  // }

  // step 1 : get the subject from url query params
  const UrlPrams = new URLSearchParams(window.location.search);
  const subject = decodeURIComponent(UrlPrams.get("subject"));
  console.log(subject);

  // step 2 : selects HTML elements
  const progress = document.getElementById("progress");
  const questionNum = document.getElementById("question-number");
  const question_text = document.getElementById("question-text");
  const ALLoptions = document.getElementById("option-container");
  const back_btn = document.getElementById("back-btn");
  const next_btn = document.getElementById("next-btn");

  // step 3 : declare variables and array of question
  let questions = [];
  let score = 0;
  let currentQuestionNum = 0;
  let selectedOption = null;
  let answeredQuestions = 0; //track answered questions

  // step 4 : load questions from question bank
  // questions = questionBank[subject];
  // console.log(questions);

  // Reset state for a new quiz
  function initializeQuiz() {
    questions = questionBank[subject] || [];
    if (questions.length === 0) {
      alert("No questions found for this subject.");
      window.location.href = "index.html";
      return false;
    }
    score = 0; // Reset score
    currentQuestionNum = 0; // Reset question number
    selectedOption = null; // Reset selected option
    // answeredQuestions=0;
    // Progress.style.width='0%'; //reset progress bar
    console.log(
      "Quiz initialized for subject:",
      subject,
      "Score reset to:",
      score
    );
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
    console.log(
      `Progress: ${progressPercentage}% for question ${
        currentQuestionNum + 1
      } of ${questions.length}`
    );
    progress.style.width = `${progressPercentage}%`;

    const option = ALLoptions.querySelectorAll(".options");
    option.forEach((div, index) => {
      div.textContent = question.options[index];
      div.classList.remove("correct", "incorrect");
      div.onclick = () => selectOption(index, div);
    });
    selectedOption = null;
    updateButtons();
  }

  function selectOption(index, div) {
    if (selectedOption !== null) return; // Prevent changing selection
    selectedOption = index;
    const question = questions[currentQuestionNum];
    const selectedAnswer = question.options[index];
    const correctAnswer = question.answer;
    const option = ALLoptions.querySelectorAll(".options");
    option.forEach((element, idx) => {
      element.classList.remove("correct", "incorrect");
      if (idx === index && selectedAnswer === correctAnswer) {
        element.classList.add("correct");
        score++;
      } else if (idx === index) {
        element.classList.add("incorrect");
      }
      if (question.options[idx] === correctAnswer) {
        element.classList.add("correct");
      }
    });
    next_btn.disabled = false;
    updateButtons();
    // answeredQuestions = Math.max(answeredQuestions, currentQuestionNum + 1);
    // const progressPercentage = (answeredQuestions / questions.length) * 100;
    // console.log(`Progress: ${progressPercentage}% after answering question ${currentQuestionNum + 1} of ${questions.length}`);
    // progress.style.width = `${progressPercentage}%`;
    // next_btn.disabled = false;
    // updateButtons();
  }

  function updateButtons() {
    back_btn.disabled = currentQuestionNum === 0;
    next_btn.disabled = selectedOption === null;
    next_btn.textContent =
      currentQuestionNum === questions.length - 1 ? "Finish" : "Next";
  }

  function animateProgress(element, finalDegrees, duration) {
    let start = 0;
    const stepTime = 1000 / 60;
    const steps = duration / stepTime;
    const increment = finalDegrees / steps;
    let current = start;

    const animate = () => {
      current += increment;
      if (current >= finalDegrees) {
        current = finalDegrees;
      }
      element.style.setProperty("--progress-degrees", `${current}deg`);
      if (current < finalDegrees) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  next_btn.addEventListener("click", () => {
    if (selectOption === null) return;

    const question = questions[currentQuestionNum];
    const selectedAnswer = question.options[selectedOption];
    const correctAnswer = question.answer;
    if (selectedAnswer === correctAnswer) score++;

    if (currentQuestionNum < questions.length - 1) {
      currentQuestionNum++;
      renderQuestion();
      answeredQuestions++;
      const degreesPerQuestion = 360 / questions.length;
      const newDegrees = answeredQuestions * degreesPerQuestion;
      animateProgress(progressElement, newDegrees, 500); // animate over 500ms
    } else {
      const percentage = Math.round((score / questions.length) * 100);
      setTimeout(() => {
        ALLoptions.parentElement.innerHTML = `
         <div class="result-container">
          <h2>Quiz Completed!</h2>
          <div class="circular-progress" style="--progress-degrees: ${
            percentage * 3.6
          }deg;">
            <div class="inner-circle">
              <Span class="percentage">${percentage}%</Span>
              <span class="score">You have scored ${score}/${
          questions.length
        } </span>

            </div>
          </div>
          <button class="dashboard-btn" onclick="window.location.href='index.html'">Back to dashboard</button>
        
         </div>
         
         `;
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
