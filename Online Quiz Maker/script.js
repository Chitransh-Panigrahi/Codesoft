// Quiz data
let quizzes = [];

// DOM elements
const homeDiv = $('#home');
const createQuizDiv = $('#quizCreation');
const takeQuizDiv = $('#quizTaking');
const quizResultsDiv = $('#quizResults');
const quizListingDiv = $('#quizListing');

// Event listeners
$('#homeLink').click(showHome);
$('#createQuizLink').click(showQuizCreation);
$('#takeQuizLink').click(showQuizListing);
$('#resultsLink').click(showResults);
$('#quizForm').submit(saveQuiz);
$('#addQuestion').click(addQuestion);
$('#submitQuiz').click(submitQuiz);
$('#backButton').click(showHome);
$('#backToHome').click(showHome);
$('#createQuizHome').click(showQuizCreation);
$('#takeQuizHome').click(showQuizListing);

// Show home page
function showHome() {
  hideAll();
  homeDiv.show();
}

// Show quiz creation form
function showQuizCreation() {
  hideAll();
  createQuizDiv.show();
}

// Show quiz listing
function showQuizListing() {
  hideAll();
  quizListingDiv.show();
}

// Show results
function showResults() {
  hideAll();
  quizResultsDiv.show();
}

// Hide all divs
function hideAll() {
  homeDiv.hide();
  createQuizDiv.hide();
  takeQuizDiv.hide();
  quizResultsDiv.hide();
  quizListingDiv.hide();
}

// Add question to quiz form
// Add question to quiz form
function addQuestion() {
  const questionContainer = $('#questionContainer');
  const questionDiv = $('<div>').addClass('form-group');
  questionDiv.html(`
    <label for="question">Question:</label>
    <input type="text" class="form-control" id="question" required>
    <div id="optionsContainer"></div>
    <label for="correctOption">Correct Option:</label>
    <select class="form-control" id="correctOption">
      <option value="">Select correct option</option>
    </select>
  `);
  questionContainer.append(questionDiv);

  const optionsContainer = questionDiv.find('#optionsContainer');
  const addOptionButton = $('<button>').addClass('btn btn-secondary mb-3').text('Add Option');
  addOptionButton.click(() => addOption(optionsContainer));
  optionsContainer.append(addOptionButton);

  // Add initial option field
  addOption(optionsContainer);
}

// Add option to question
function addOption(optionsContainer) {
  const optionCount = optionsContainer.children('.option-input').length + 1; // Increment option count
  const optionInput = $('<input>').addClass('form-control mb-3 option-input').attr('type', 'text').attr('required', true).attr('placeholder', `Option ${optionCount}`);
  optionsContainer.append(optionInput);

  // Update the correct option dropdown
  const correctOptionSelect = optionsContainer.closest('.form-group').find('#correctOption');
  const newOption = $('<option>').attr('value', optionCount - 1).text(`Option ${optionCount}`);
  correctOptionSelect.append(newOption);

  // Clear the input field
  optionInput.val('');
}



// Save quiz
function saveQuiz(e) {
  e.preventDefault();
  const quizTitle = $('#quizTitle').val();
  const questions = $('#questionContainer > div').map((index, questionDiv) => {
    const question = $(questionDiv).find('#question').val();
    const options = $(questionDiv).find('#optionsContainer input').map((i, option) => $(option).val()).get();
    const correctOption = $(questionDiv).find('#correctOption').val();
    return { question, options, correctOption };
  }).get();

  quizzes.push({ title: quizTitle, questions });
  createQuizDiv.hide();
  homeDiv.show();
  $('#quizForm')[0].reset();
  $('#questionContainer').empty();
}


// Show quiz listing
function showQuizListing() {
  hideAll();
  quizListingDiv.show();
  const quizList = $('#quizList');
  quizList.empty();
  quizzes.forEach((quiz, index) => {
    const li = $('<li>').addClass('list-group-item').text(quiz.title);
    li.click(() => startQuiz(index));
    quizList.append(li);
  });
}

// Start quiz
function startQuiz(index) {
  const quiz = quizzes[index];
  takeQuizDiv.show();
  quizListingDiv.hide();
  $('#quizTitle').text(quiz.title);
  displayQuestion(quiz, 0);
}

function displayQuestion(quiz, questionIndex) {
  const questionDisplay = $('#questionDisplay');
  questionDisplay.empty();

  const question = quiz.questions[questionIndex];
  const questionDiv = $('<div>').html(`<h3>${question.question}</h3>`);
  questionDisplay.append(questionDiv);

  const optionsDiv = $('<div>');
  question.options.forEach((option, optionIndex) => {
    const optionDiv = $('<div>').addClass('form-check');
    optionDiv.html(`
      <input type="radio" class="form-check-input" name="answer" data-question-index="${questionIndex}" value="${option}">
      <label class="form-check-label">${option}</label>
    `);
    optionsDiv.append(optionDiv);
  });
  questionDisplay.append(optionsDiv);

  if (questionIndex === quiz.questions.length - 1) {
    $('#submitQuiz').show();
  } else {
    const nextButton = $('<button>').addClass('btn btn-primary mt-3').text('Next');
    nextButton.click(() => displayQuestion(quiz, questionIndex + 1));
    questionDisplay.append(nextButton);
  }
}



function displayResults(quiz, score, correctAnswers) {
  takeQuizDiv.hide();
  quizResultsDiv.show();
  $('#score').text(`You scored ${score} out of ${quiz.questions.length}`);
  const correctAnswersDisplay = $('#correctAnswers');
  correctAnswersDisplay.empty();
  correctAnswers.forEach(answer => {
    const p = $('<p>').text(answer);
    correctAnswersDisplay.append(p);
  });

  // Retake quiz button
  $('#retakeQuiz').click(() => startQuiz(quizzes.indexOf(quiz)));
}

// Submit quiz

function submitQuiz() {
  const quiz = quizzes.find(q => q.title === $('#quizTitle').text());
  let score = 0;
  const correctAnswers = [];

  quiz.questions.forEach((question, index) => {
    const selectedAnswer = $('input[name="answer"]:checked', `#questionDisplay`).val(); // Get the selected answer
    const correctOptionIndex = parseInt(question.correctOption); // Convert correct option to index
    if (selectedAnswer === question.options[correctOptionIndex]) { // Compare selected answer with correct option
      score++;
    } else {
      correctAnswers.push(`${question.question}: ${question.options[correctOptionIndex]}`);
    }
  });

  displayResults(quiz, score, correctAnswers);
}
