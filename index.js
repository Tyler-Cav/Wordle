let wordleContainer = document.querySelector(".wordle-container");
let guessCounter = 0;
let wordOfTheDay = "";

async function getWordOfTheDay() {
  let callApi = await fetch("https://words.dev-apis.com/word-of-the-day");
  let responseText = await callApi.json();
  wordOfTheDay = responseText.word;
}

async function validateUserInput(word) {
  const response = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: `${word}` }),
  });
  let check = await response.json();
  let isWord = check.validWord;
  return isWord;
}

async function initializeGame() {
  await getWordOfTheDay();
  await validateUserInput();
}

initializeGame();

// Only allowing certain keys to interact with the page
function isLetter(letter) {
  return (
    /^[a-zA-Z]$/.test(letter) ||
    letter === "Backspace" ||
    letter === "Delete" ||
    letter === "Tab"
  );
}
// Creating the rows and inputs for each row
for (let i = 0; i < 6; i++) {
  let guessingRow = document.createElement("ul");
  guessingRow.className = `row-${i + 1}`;
  wordleContainer.append(guessingRow);
  for (let z = 0; z < 5; z++) {
    let letterInputSquare = document.createElement("input");
    letterInputSquare.addEventListener("keydown", (e) => {
      if (!isLetter(e.key)) {
        e.preventDefault();
      }
    });
    if (z === 0) {
      letterInputSquare.setAttribute("autofocus", true);
    }
    letterInputSquare.setAttribute("maxlength", "1");
    letterInputSquare.setAttribute("id", `row-${i + 1}-input${z + 1}`);
    guessingRow.append(letterInputSquare);
  }
}
// Checks the active row for the users guess and validates all 5 inputs have letters
function userGuessLengthAndValue() {
  const row = wordleContainer.children[guessCounter];
  const inputs = row.querySelectorAll("input");
  let rowInputObject = {
    inputLength: 0,
    inputValue: "",
  };
  inputs.forEach((input) => {
    if (input.value.length === 1) {
      rowInputObject.inputLength++;
      rowInputObject.inputValue += input.value.toLowerCase();
    }
  });
  return rowInputObject;
}

function submittedGuessCheck(userGuess) {
  for (let i = 0; i < 5; i++) {
    let specificInput = document.querySelector(
      `#row-${guessCounter}-input${i + 1}`
    );
    if (userGuess[i] === wordOfTheDay[i]) {
      specificInput.className = "correct";
    } else if (wordOfTheDay.includes(userGuess[i])) {
      let noDoubleDipCheck = wordOfTheDay.split("");
      for (let z = 0; z < 5; z++) {
        if (userGuess[i] === noDoubleDipCheck[z]) {
          noDoubleDipCheck[z] = "x";
          specificInput.className = "almost-correct";
          break;
        }
      }
    }
  }
}

document.addEventListener("keydown", async (e) => {
  let rowInfo = userGuessLengthAndValue();
  if (
    e.key === "Enter" &&
    rowInfo.inputLength === 5 &&
    (await validateUserInput(rowInfo.inputValue))
  ) {
    if (guessCounter === 5) {
      let pTag = document.createElement("p");
      pTag.innerText = "All Done";
      wordleContainer.append(pTag);
    }
    guessCounter++;
    submittedGuessCheck(rowInfo.inputValue);
    activeRow();
  }
});

function activeRow() {
  for (let i = 0; i < wordleContainer.childElementCount; i++) {
    const row = wordleContainer.children[i];
    const inputs = row.querySelectorAll("input");

    if (i === guessCounter) {
      inputs.forEach((input) => {
        input.removeAttribute("disabled");
      });
    } else {
      inputs.forEach((input) => {
        input.setAttribute("disabled", true);
      });
    }
  }
}

activeRow();
