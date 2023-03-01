
var questions = [
    {
        questionText: "Commonly used data types DO NOT include:",
        options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
        answer: "3. alerts",
    },
    {
        questionText: "Arrays in JavaScript can be used to store ______.",
        options: [
            "1. Numbers & Strings",
            "2. Other Arrays",
            "3. Booleans",
            "4. All Of The Above",
        ],
        answer: "4. All Of The Above",
    },
    {
        questionText:
            "String Values Must Be Enclosed Within _____ When Being assigned to variables.",
        options: ["1. Commas", "2. Curly Brackets", "3. Quotes", "4. Parentheses"],
        answer: "3. Quotes",
    },
    {
        questionText:
            "A very useful tool used during development and debugging for printing content to the debugger is:",
        options: [
            "1. JavaScript",
            "2. terminal/bash",
            "3. for loops",
            "4. console.log",
        ],
        answer: "4. console.log",
    },
    {
        questionText:
            "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
        options: ["1. break", "2. Stop", "3. Back", "4. Exit"],
        answer: "1. break",
    },
];


var startCard = document.querySelector("#start-card");
var questionCard = document.querySelector("#question-card");
var scoreCard = document.querySelector("#score-card");
var leaderboardCard = document.querySelector("#leaderboard-card");

//hide all cards
function hideCards() {
    startCard.setAttribute("hidden", true);
    questionCard.setAttribute("hidden", true);
    scoreCard.setAttribute("hidden", true);
    leaderboardCard.setAttribute("hidden", true);
}

var resultDiv = document.querySelector("#result-div");
var resultText = document.querySelector("#result-text");


function hideResultText() {
    resultDiv.style.display = "none";
}


var intervalID;
var time;
var currentQuestion;

document.querySelector("#start-button").addEventListener("click", startQuiz);

function startQuiz() {
    //hide any visible cards, show the question card
    hideCards();
    questionCard.removeAttribute("hidden");

    
    currentQuestion = 0;
    displayQuestion();

    //set total time depending on number of questions
    time = questions.length * 10;

    //executes function "countdown" every 1000ms to update time and display on page
    intervalID = setInterval(countdown, 1000);

    //invoke displayTime here to ensure time appears on the page as soon as the start button is clicked, not after 1 second
    displayTime();
}

//reduce time by 1 and display new value, if time runs out then end quiz
function countdown() {
    time--;
    displayTime();
    if (time < 1) {
        endQuiz();
    }
}

//display time on page
var timeDisplay = document.querySelector("#time");
function displayTime() {
    timeDisplay.textContent = time;
}

//display the question and answer options for the current question
function displayQuestion() {
    let question = questions[currentQuestion];
    let options = question.options;

    let h2QuestionElement = document.querySelector("#question-text");
    h2QuestionElement.textContent = question.questionText;

    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let optionButton = document.querySelector("#option" + i);
        optionButton.textContent = option;
    }
}


document.querySelector("#quiz-options").addEventListener("click", checkAnswer);


function optionIsCorrect(optionButton) {
    return optionButton.textContent === questions[currentQuestion].answer;
}


function checkAnswer(eventObject) {
    let optionButton = eventObject.target;
    resultDiv.style.display = "block";
    if (optionIsCorrect(optionButton)) {
        resultText.textContent = "Correct!";
        setTimeout(hideResultText, 1000);
    } else {
        resultText.textContent = "Incorrect!";
        setTimeout(hideResultText, 1000);
        if (time >= 10) {
            time = time - 10;
            displayTime();
        } else {

            time = 0;
            displayTime();
            endQuiz();
        }
    }


    currentQuestion++;

    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}


const score = document.querySelector("#score");


function endQuiz() {
    clearInterval(intervalID);
    hideCards();
    scoreCard.removeAttribute("hidden");
    score.textContent = time;
}

const submitButton = document.querySelector("#submit-button");
const inputElement = document.querySelector("#initials");


submitButton.addEventListener("click", storeScore);

function storeScore(event) {

    event.preventDefault();


    if (!inputElement.value) {
        alert("Please enter your initials before pressing submit!");
        return;
    }


    let leaderboardItem = {
        initials: inputElement.value,
        score: time,
    };

    updateStoredLeaderboard(leaderboardItem);


    hideCards();
    leaderboardCard.removeAttribute("hidden");

    renderLeaderboard();
}


function updateStoredLeaderboard(leaderboardItem) {
    let leaderboardArray = getLeaderboard();
    //append new leaderboard item to leaderboard array
    leaderboardArray.push(leaderboardItem);
    localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}


function getLeaderboard() {
    let storedLeaderboard = localStorage.getItem("leaderboardArray");
    if (storedLeaderboard !== null) {
        let leaderboardArray = JSON.parse(storedLeaderboard);
        return leaderboardArray;
    } else {
        leaderboardArray = [];
    }
    return leaderboardArray;
}

//display leaderboard on leaderboard card
function renderLeaderboard() {
    let sortedLeaderboardArray = sortLeaderboard();
    const highscoreList = document.querySelector("#highscore-list");
    highscoreList.innerHTML = "";
    for (let i = 0; i < sortedLeaderboardArray.length; i++) {
        let leaderboardEntry = sortedLeaderboardArray[i];
        let newListItem = document.createElement("li");
        newListItem.textContent =
            leaderboardEntry.initials + " - " + leaderboardEntry.score;
        highscoreList.append(newListItem);
    }
}

//sort leaderboard array from highest to lowest
function sortLeaderboard() {
    let leaderboardArray = getLeaderboard();
    if (!leaderboardArray) {
        return;
    }

    leaderboardArray.sort(function (a, b) {
        return b.score - a.score;
    });
    return leaderboardArray;
}

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

//clear local storage and display empty leaderboard
function clearHighscores() {
    localStorage.clear();
    renderLeaderboard();
}

const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);

//Hide leaderboard card show start card
function returnToStart() {
    hideCards();
    startCard.removeAttribute("hidden");
}

//use link to view highscores from any point on the page
const leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
    hideCards();
    leaderboardCard.removeAttribute("hidden");

    //stop countdown
    clearInterval(intervalID);

    //assign undefined to time and display that, so that time does not appear on page
    time = undefined;
    displayTime();

    //display leaderboard on leaderboard card
    renderLeaderboard();
}
