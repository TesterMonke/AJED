const questions = [
  {
    prompt: 'x + 9 = 17',
    answer: 8,
    hint: 'Subtract 9 from both sides to isolate x.',
    explanation: 'x + 9 = 17 → x = 17 - 9 → x = 8'
  },
  {
    prompt: 'x - 6 = 12',
    answer: 18,
    hint: 'Add 6 to both sides to undo subtracting 6.',
    explanation: 'x - 6 = 12 → x = 12 + 6 → x = 18'
  },
  {
    prompt: '4x = 36',
    answer: 9,
    hint: 'Divide both sides by 4 to find x.',
    explanation: '4x = 36 → x = 36 ÷ 4 → x = 9'
  },
  {
    prompt: '2x + 3 = 15',
    answer: 6,
    hint: 'First subtract 3, then divide by 2.',
    explanation: '2x + 3 = 15 → 2x = 12 → x = 6'
  }
];

const state = {
  currentScreen: 'dashboard',
  score: 0,
  totalQuestions: questions.length,
  completed: new Set()
};

const screens = {
  dashboard: document.getElementById('dashboard-screen'),
  mathematics: document.getElementById('mathematics-screen'),
  lesson: document.getElementById('lesson-screen'),
  practice: document.getElementById('practice-screen')
};

function showScreen(name) {
  state.currentScreen = name;

  Object.entries(screens).forEach(([key, screen]) => {
    screen.classList.toggle('active', key === name);
  });
}

function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('score-display');
  if (scoreDisplay) {
    scoreDisplay.textContent = String(state.score);
  }
}

function renderQuestions() {
  const container = document.getElementById('question-list');
  if (!container) return;

  container.innerHTML = questions
    .map(
      (question, index) => `
        <article class="question-card" data-index="${index}">
          <div class="question-top">
            <span class="question-number">Question ${index + 1}</span>
          </div>
          <div class="question-text">${question.prompt}</div>
          <div class="answer-row">
            <input
              class="answer-input"
              type="number"
              inputmode="numeric"
              data-index="${index}"
              placeholder="Type your answer"
              aria-label="Answer for ${question.prompt}"
            />
            <button class="submit-btn" data-index="${index}" type="button">Submit</button>
          </div>
          <div class="feedback" data-feedback="${index}" aria-live="polite"></div>
        </article>
      `
    )
    .join('');
}

function handleAnswer(index) {
  const card = document.querySelector(`.question-card[data-index="${index}"]`);
  const input = document.querySelector(`.answer-input[data-index="${index}"]`);
  const feedback = document.querySelector(`[data-feedback="${index}"]`);

  if (!card || !input || !feedback) return;

  const question = questions[index];
  const enteredValue = Number(input.value.trim());

  if (input.value.trim() === '') {
    feedback.textContent = 'Please enter an answer before submitting.';
    feedback.className = 'feedback error';
    return;
  }

  if (Number.isNaN(enteredValue)) {
    feedback.textContent = 'That is not a valid number. Try again.';
    feedback.className = 'feedback error';
    return;
  }

  if (enteredValue === question.answer) {
    feedback.textContent = `Correct! ${question.explanation}`;
    feedback.className = 'feedback success';
    card.classList.add('correct');
    card.classList.remove('incorrect');

    if (!state.completed.has(index)) {
      state.completed.add(index);
      state.score += 1;
      updateScoreDisplay();
    }

    input.disabled = true;
    const button = document.querySelector(`.submit-btn[data-index="${index}"]`);
    if (button) button.disabled = true;
    return;
  }

  feedback.textContent = `Not quite. ${question.hint}`;
  feedback.className = 'feedback error';
  card.classList.add('incorrect');
  card.classList.remove('correct');
}

function attachNavigation() {
  document.querySelectorAll('[data-nav]').forEach((button) => {
    const target = button.getAttribute('data-nav');
    if (!target) return;

    button.addEventListener('click', () => {
      showScreen(target);
    });
  });
}

function attachPracticeHandlers() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.submit-btn');
    if (!button) return;

    const index = Number(button.getAttribute('data-index'));
    handleAnswer(index);
  });
}

function init() {
  attachNavigation();
  attachPracticeHandlers();
  renderQuestions();
  updateScoreDisplay();
  showScreen('dashboard');
}

init();
