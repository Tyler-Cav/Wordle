let wordleContainer = document.querySelector(".wordle-container");

function isLetter(letter) {
  return (
    /^[a-zA-Z]$/.test(letter) || letter === "Backspace" || letter == "Delete"
  );
}

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
    letterInputSquare.setAttribute("maxlength", "1");
    letterInputSquare.setAttribute("id", `row-${i + 1}-input${z + 1}`);
    guessingRow.append(letterInputSquare);
  }
}

for (let i = 1; i < 7; i++) {
  let guessRowCheck = document.querySelector(`.row-${i}`);
  guessRowCheck.addEventListener("change", (e) => {
    let currentUserGuess = "";
    for (const child of guessRowCheck.children) {
      currentUserGuess += child.value;
    }
    console.log(`row${i}:${currentUserGuess}`);
  });
}
