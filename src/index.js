const container = document.getElementById("alphabetButtons");
const answerDisplay = document.getElementById("hold");
const containerHint = document.getElementById("clue");
const buttonHint = document.getElementById("hint");
const buttonReset = document.getElementById("reset");
const livesDisplay = document.getElementById("mylives");
const myStickman = document.getElementById("stickman");
const context = myStickman.getContext("2d");

let answer = "";
let hint = "";
let life = 10;
let state = 0; // 0: running, 1: finished
let wordDisplay = [];
let winningCheck = "";

//generate alphabet button
function generateButton() {
  return "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map(
      (letter) =>
        `<button
         class="alphabet-button"
         id="${letter}"
         >
        ${letter}
        </button>`
    )
    .join("");
}

function handleClick(event) {
  if (event.target.nodeName === "BUTTON") {
    event.target.classList.add("selected");
  }
}

//word array
const question = [
  "The Chosen Category Is Premier League Football Teams",
  "The Chosen Category Is Films",
  "The Chosen Category Is Cities",
];

const categories = [
  [
    "everton",
    "liverpool",
    "swansea",
    "chelsea",
    "hull",
    "manchester-city",
    "newcastle-united",
  ],
  ["alien", "dirty-harry", "gladiator", "finding-nemo", "jaws"],
  ["manchester", "milan", "madrid", "amsterdam", "prague"],
];

const hints = [
  [
    "Based in Mersyside",
    "Based in Mersyside",
    "First Welsh team to reach the Premier Leauge",
    "Owned by A russian Billionaire",
    "Once managed by Phil Brown",
    "2013 FA Cup runners up",
    "Gazza's first club",
  ],
  [
    "Science-Fiction horror film",
    "1971 American action film",
    "Historical drama",
    "Anamated Fish",
    "Giant great white shark",
  ],
  [
    "Northern city in the UK",
    "Home of AC and Inter",
    "Spanish capital",
    "Netherlands capital",
    "Czech Republic capital",
  ],
];

//set question,answer and hint
function setAnswer() {
  const categoryOrder = Math.floor(Math.random() * categories.length);
  const chosenCategory = categories[categoryOrder];
  const wordOrder = Math.floor(Math.random() * chosenCategory.length);
  const chosenWord = chosenCategory[wordOrder];

  document.getElementById("categoryName").innerHTML = question[categoryOrder];

  answer = chosenWord;
  hint = hints[categoryOrder][wordOrder];
  answerDisplay.innerHTML = generateAnswerDisplay(chosenWord);
}

function generateAnswerDisplay(word) {
  wordDisplay = word.split("").map((char) => (char === "-" ? "-" : "_"));
  return wordDisplay.join(" ");
}

function showHint(event) {
  containerHint.innerHTML = `Clue - ${hint}`;
  handleClick(event);
}

//setting initial condition
function init() {
  answer = "";
  hint = "";
  life = 10;
  state = 0;
  wordDisplay = [];
  winningCheck = "";
  context.clearRect(0, 0, 400, 400);
  canvas();
  containerHint.innerHTML = `Clue -`;
  livesDisplay.innerHTML = `You have ${life} lives!`;
  setAnswer();
  container.innerHTML = generateButton();
  buttonHint.classList.remove("selected");
  buttonHint.addEventListener("click", showHint);
}

window.onload = init();

//reset (play again)
buttonReset.addEventListener("click", init);

//guess click
function guess(event) {
  const isButton = event.target.nodeName === "BUTTON";
  const isSelected = event.target.classList.contains("selected");

  if (isButton && !isSelected && state == 0) {
    handleClick(event);
    const guessWord = event.target.id;
    const answerArray = answer.split("");
    let counter = 0;

    if (answer === winningCheck) {
      state = 1;
      livesDisplay.innerHTML = `YOU WIN!`;
      return;
    } else if (life > 0) {
      for (let j = 0; j < answer.length; j++) {
        if (guessWord === answerArray[j]) {
          wordDisplay[j] = guessWord;
          answerDisplay.innerHTML = wordDisplay.join(" ");
          winningCheck = wordDisplay.join("");
          counter += 1;
        }
      }
      if (counter === 0) {
        life -= 1;
        animate();
      }
      updateLivesDisplay();
    }

    if (answer === winningCheck) {
      state = 1;
      livesDisplay.innerHTML = `YOU WIN!`;
      return;
    }
  }
}

function updateLivesDisplay() {
  if (life > 1) {
    livesDisplay.innerHTML = `You have ${life} lives!`;
  } else if (life === 1) {
    livesDisplay.innerHTML = `You have ${life} life!`;
  } else {
    state = 1;
    answerDisplay.innerHTML = answer.split("").join(" ");
    livesDisplay.innerHTML = `GAME OVER!`;
  }
}

container.addEventListener("click", guess);

// Hangman
function animate() {
  drawPart(parts[life]);
}

function canvas() {
  context.beginPath();
  context.strokeStyle = "#fff";
  context.lineWidth = 2;
}

function drawCircle(x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, true);
  context.stroke();
}

function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

function drawPart(part) {
  if (part.type === "circle") {
    drawCircle(part.x, part.y, part.radius);
  } else if (part.type === "line") {
    drawLine(part.x1, part.y1, part.x2, part.y2);
  }
}

const parts = [
  { type: "line", x1: 60, y1: 70, x2: 100, y2: 100 }, // rightLeg
  { type: "line", x1: 60, y1: 70, x2: 20, y2: 100 }, // leftLeg
  { type: "line", x1: 60, y1: 46, x2: 100, y2: 50 }, // rightArm
  { type: "line", x1: 60, y1: 46, x2: 20, y2: 50 }, // leftArm
  { type: "line", x1: 60, y1: 36, x2: 60, y2: 70 }, // torso
  { type: "circle", x: 60, y: 25, radius: 10 }, // head
  { type: "line", x1: 60, y1: 5, x2: 60, y2: 15 }, // frame4
  { type: "line", x1: 0, y1: 5, x2: 70, y2: 5 }, // frame3
  { type: "line", x1: 10, y1: 0, x2: 10, y2: 600 }, // frame2
  { type: "line", x1: 0, y1: 150, x2: 150, y2: 150 }, // frame1
];
