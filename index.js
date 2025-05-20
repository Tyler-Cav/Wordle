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

function focusCheck(currentChild) {
  let nextChild = currentChild.nextElementSibling;
  if (nextChild && currentChild.value !== "") {
    nextChild.setAttribute("focus", true);
    nextChild.focus();
  }
}

function Backspace(currentChild) {
  currentChild.value = "";
  currentChild.removeAttribute("focus");
  let previousChild = currentChild.previousElementSibling;
  if (previousChild) {
    previousChild.setAttribute("focus", true);
    previousChild.focus();
  }
}
// Creating the rows and inputs for each row
for (let i = 0; i < 6; i++) {
  let guessingRow = document.createElement("ul");
  guessingRow.className = `row-${i + 1}`;
  wordleContainer.append(guessingRow);
  for (let z = 0; z < 5; z++) {
    let letterInputSquare = document.createElement("input");
    letterInputSquare.addEventListener("keyup", (e) => {
      let currentChildInput = guessingRow.children[z];
      if (!isLetter(e.key)) {
        e.preventDefault();
      } else if (e.key === "Backspace") {
        Backspace(currentChildInput);
      } else {
        focusCheck(currentChildInput);
      }
    });
    if (z === 0) {
      letterInputSquare.setAttribute("focus", true);
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
  let wordOfDay = wordOfTheDay.split("");
  let matchedIndices = new Array(5).fill(false);
  for (let i = 0; i < 5; i++) {
    let specificInput = document.querySelector(
      `#row-${guessCounter}-input${i + 1}`
    );
    if (userGuess[i] === wordOfTheDay[i]) {
      specificInput.className = "correct";
      matchedIndices[i] = true;
    } else {
      specificInput.className = "not-in-word";
    }
  }
  for (let i = 0; i < 5; i++) {
    let specificInput = document.querySelector(
      `#row-${guessCounter}-input${i + 1}`
    );
    if (userGuess[i] !== wordOfTheDay[i] && wordOfDay.includes(userGuess[i])) {
      for (let z = 0; z < 5; z++) {
        if (userGuess[i] === wordOfDay[z] && !matchedIndices[z]) {
          matchedIndices[z] = true;
          specificInput.className = "almost-correct";
          break;
        }
      }
    }
  }
}

document.addEventListener("keydown", async (e) => {
  let rowInfo = userGuessLengthAndValue();
  let userRowGuess = rowInfo.inputValue;
  if (
    e.key === "Enter" &&
    rowInfo.inputLength === 5 &&
    (await validateUserInput(rowInfo.inputValue))
  ) {
    if (guessCounter === 5 && rowInfo.inputValue != wordOfTheDay) {
      let pTag = document.createElement("p");
      pTag.innerText = `Better Luck Next Time! Todays Word: ${wordOfTheDay.toUpperCase()}`;
      pTag.style.fontSize = "50px";
      pTag.style.textAlign = "center";
      wordleContainer.append(pTag);
    }
    guessCounter++;
    submittedGuessCheck(userRowGuess);
    if (userRowGuess === wordOfTheDay) {
      let h2Tag = document.createElement("h2");
      if (guessCounter === 1) {
        h2Tag.innerText = `First Try No Sweat`;
      } else {
        h2Tag.innerText = `Congrats! Solved within ${guessCounter} attempts`;
      }
      h2Tag.style.fontSize = "50px";
      h2Tag.style.textAlign = "center";
      wordleContainer.insertBefore(h2Tag, wordleContainer.children[0]);
      guessCounter = 7;
    } else {
      activeRow();
    }
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
      let firstInputEachRow = document.querySelector(`#row-${i + 1}-input1`);
      firstInputEachRow.focus();
    } else {
      inputs.forEach((input) => {
        input.setAttribute("disabled", true);
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  guessCounter = 0;
  activeRow();
});
