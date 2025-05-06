let wordleContainer = document.querySelector(".wordle-container");
let guessCounter = 0;
let wordOfTheDay = "stoop";

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
      rowInputObject.inputValue += input.value;
    }
  });
  return rowInputObject;
}

document.addEventListener("keydown", (e) => {
  let rowInfo = userGuessLengthAndValue();
  if (e.key === "Enter" && rowInfo.inputLength === 5) {
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

function submittedGuessCheck(userGuess) {
  for (let i = 0; i < 5; i++) {
    if (userGuess[i] === wordOfTheDay[i]) {
      let specificInput = document.querySelector(
        `#row-${guessCounter}-input${i + 1}`
      );
      specificInput.style.backgroundColor = "lightgreen";
      console.log(`letter at position ${i} is correct`);
    } else if (wordOfTheDay.includes(userGuess[i])) {
      console.log(`${userGuess[i]} is included but wrong spot`);
    }
  }
}

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
