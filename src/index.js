const hangmanGame = (function () {
  const elements = {
    container: document.getElementById("alphabetButtons"),
    answerDisplay: document.getElementById("hold"),
    containerHint: document.getElementById("clue"),
    buttonHint: document.getElementById("hint"),
    buttonReset: document.getElementById("reset"),
    livesDisplay: document.getElementById("mylives"),
    myStickman: document.getElementById("stickman"),
    context: document.getElementById("stickman").getContext("2d"),
  };

  let state = {
    answer: "",
    hint: "",
    life: 10,
    gameState: 0, // 0: running, 1: finished
    wordDisplay: [],
    winningCheck: "",
  };

  const wordBank = [
    {
      question: "The Chosen Category Is Premier League Football Teams",
      words: [
        "everton",
        "liverpool",
        "swansea",
        "chelsea",
        "hull",
        "manchester-city",
        "newcastle-united",
      ],
      hints: [
        "Based in Mersyside",
        "Based in Mersyside",
        "First Welsh team to reach the Premier Leauge",
        "Owned by A russian Billionaire",
        "Once managed by Phil Brown",
        "2013 FA Cup runners up",
        "Gazza's first club",
      ],
    },
    {
      question: "The Chosen Category Is Films",
      words: ["alien", "dirty-harry", "gladiator", "finding-nemo", "jaws"],
      hints: [
        "Science-Fiction horror film",
        "1971 American action film",
        "Historical drama",
        "Anamated Fish",
        "Giant great white shark",
      ],
    },
    {
      question: "The Chosen Category Is Cities",
      words: ["manchester", "milan", "madrid", "amsterdam", "prague"],
      hints: [
        "Northern city in the UK",
        "Home of AC and Inter",
        "Spanish capital",
        "Netherlands capital",
        "Czech Republic capital",
      ],
    },
    {
      question: "The Chosen Category Is Games",
      words: [
        "league-of-legend",
        "overwatch",
        "starcraft",
        "battle-ground",
        "maple-story",
      ],
      hints: [
        "Popular MOBA(AOS) game",
        "First-person shooter by Blizzard",
        "Classic real-time strategy game",
        "Battle royale game",
        "2D side-scrolling MMORPG",
      ],
    },
    {
      question: "The Chosen Category Is Animals",
      words: ["elephant", "giraffe", "kangaroo", "penguin", "dolphin"],
      hints: [
        "Large mammal with tusks and trunk",
        "Tallest land animal",
        "Australian marsupial known for hopping",
        "Flightless bird native to Antarctica",
        "Intelligent marine mammal",
      ],
    },
    {
      question: "The Chosen Category Is Car Brands",
      words: ["porsche", "ford", "ferrari", "bmw", "audi"],
      hints: [
        "German automaker known for sports cars and the 911 model",
        "American automaker known for the Mustang",
        "Italian automaker known for sports cars",
        "German automaker with a blue and white logo",
        "German automaker with four interlocking rings",
      ],
    },
    {
      question: "The Chosen Category Is Musicians",
      words: [
        "elvis-presley",
        "madonna",
        "beethoven",
        "bob-dylan",
        "freddie-mercury",
      ],
      hints: [
        "The King of Rock and Roll",
        "Queen of Pop",
        "Classical composer and pianist",
        "American singer-songwriter known for 'Blowin' in the Wind'",
        "Lead vocalist of Queen",
      ],
    },
    {
      question: "The Chosen Category Is Authors",
      words: [
        "william-shakespeare",
        "jane-austen",
        "george-orwell",
        "mark-twain",
        "j-k-rowling",
      ],
      hints: [
        "English playwright and poet",
        "Wrote 'Pride and Prejudice'",
        "Author of '1984' and 'Animal Farm'",
        "Wrote 'The Adventures of Tom Sawyer'",
        "Created the 'Harry Potter' series",
      ],
    },
    {
      question: "The Chosen Category Is Computer Terms",
      words: ["algorithm", "database", "hardware", "software", "cache"],
      hints: [
        "Step-by-step process for calculations",
        "Structured set of data",
        "Physical components of a computer",
        "Programs and applications",
        "Temporary storage for quick access",
      ],
    },
    {
      question: "The Chosen Category Is Foods",
      words: ["sushi", "pizza", "tacos", "hamburger", "ramen"],
      hints: [
        "Japanese raw fish dish",
        "Italian dish with a dough base",
        "Mexican dish with folded tortillas",
        "American sandwich with ground beef patty",
        "Japanese noodle soup",
      ],
    },
  ];

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

  function init() {
    resetGameState();
    resetCanvas();
    setAnswer();
    initHint();
    setButtonEventListeners();
    updateLivesDisplay();
  }

  function resetGameState() {
    state = {
      answer: "",
      hint: "",
      life: 10,
      gameState: 0,
      wordDisplay: [],
      winningCheck: "",
    };
  }

  function resetCanvas() {
    elements.context.clearRect(0, 0, 400, 400);
    elements.context.beginPath();
    elements.context.strokeStyle = "#fff";
    elements.context.lineWidth = 2;
  }

  function setAnswer() {
    const categoryOrder = Math.floor(Math.random() * wordBank.length);
    const chosenCategory = wordBank[categoryOrder];
    const wordOrder = Math.floor(Math.random() * chosenCategory.words.length);
    const chosenWord = chosenCategory.words[wordOrder];

    document.getElementById("categoryName").innerHTML = chosenCategory.question;

    state.answer = chosenWord;
    state.hint = chosenCategory.hints[wordOrder];
    elements.answerDisplay.innerHTML = generateAnswerDisplay(chosenWord);
  }

  function initHint() {
    elements.containerHint.innerHTML = `Clue -`;
    elements.buttonHint.classList.remove("selected");
  }

  function generateAnswerDisplay(word) {
    state.wordDisplay = word
      .split("")
      .map((char) => (char === "-" ? "-" : "_")); // 띄어쓰기
    return state.wordDisplay.join(" ");
  }

  function setButtonEventListeners() {
    elements.container.innerHTML = generateButton();
    elements.container.addEventListener("click", guess);
    elements.buttonHint.addEventListener("click", showHint);
    elements.buttonReset.addEventListener("click", init);
  }

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

  function guess(event) {
    const isButton = event.target.nodeName === "BUTTON";
    const isSelected = event.target.classList.contains("selected");

    if (isButton && !isSelected && state.gameState == 0) {
      handleClick(event, "selected");
      const guessWord = event.target.id;
      const answerArray = state.answer.split("");
      let counter = 0;

      if (state.answer === state.winningCheck) {
        state.gameState = 1;
        elements.livesDisplay.innerHTML = `YOU WIN!`;
        return;
      } else if (state.life > 0) {
        for (let j = 0; j < state.answer.length; j++) {
          if (guessWord === answerArray[j]) {
            state.wordDisplay[j] = guessWord;
            elements.answerDisplay.innerHTML = state.wordDisplay.join(" ");
            state.winningCheck = state.wordDisplay.join("");
            counter += 1;
          }
        }
        if (counter === 0) {
          state.life -= 1;
          animate();
        }
        updateLivesDisplay();
      }

      if (state.answer === state.winningCheck) {
        state.gameState = 1;
        elements.livesDisplay.innerHTML = `YOU WIN!`;
        return;
      }
    }
  }

  function showHint(event) {
    elements.containerHint.innerHTML = `Clue - ${state.hint}`;
    handleClick(event, "selected");
  }

  function handleClick(event, className) {
    event.target.classList.add(className);
  }

  function updateLivesDisplay() {
    if (state.life > 1) {
      elements.livesDisplay.innerHTML = `You have ${state.life} lives!`;
    } else if (state.life === 1) {
      elements.livesDisplay.innerHTML = `You have ${state.life} life!`;
    } else {
      state.gameState = 1;
      elements.answerDisplay.innerHTML = state.answer.split("").join(" ");
      elements.livesDisplay.innerHTML = `GAME OVER!`;
    }
  }

  function animate() {
    drawPart(parts[state.life]);
  }

  function drawCircle(x, y, radius) {
    elements.context.beginPath();
    elements.context.arc(x, y, radius, 0, Math.PI * 2, true);
    elements.context.stroke();
  }

  function drawLine(x1, y1, x2, y2) {
    elements.context.beginPath();
    elements.context.moveTo(x1, y1);
    elements.context.lineTo(x2, y2);
    elements.context.stroke();
  }

  function drawPart(part) {
    if (part.type === "circle") {
      drawCircle(part.x, part.y, part.radius);
    } else if (part.type === "line") {
      drawLine(part.x1, part.y1, part.x2, part.y2);
    }
  }

  // Initialize the game
  init();
})();
