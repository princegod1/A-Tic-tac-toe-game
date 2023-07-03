const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

function initializeGame() {
  cells.forEach(cell => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  statusText.textContent = `${currentPlayer}'s turn`;
}

function cellClicked() {
  const cellIndex = Array.from(cells).indexOf(this);
  if (options[cellIndex] === "" && currentPlayer === "X") {
    updateCell(this, cellIndex);
    if (checkWinCondition()) {
      endGame(`${currentPlayer} wins!`);
    } else if (isBoardFull()) {
      endGame("It's a draw!");
    } else {
      currentPlayer = "O";
      statusText.textContent = `${currentPlayer}'s turn`;
      makeComputerMove();
    }
  }
}

function updateCell(cell, index) {
  cell.textContent = currentPlayer;
  options[index] = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinCondition() {
  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (
      options[a] !== "" &&
      options[a] === options[b] &&
      options[b] === options[c]
    ) {
      return true;
    }
  }
  return false;
}

function isBoardFull() {
  return options.every(option => option !== "");
}

function endGame(message) {
  statusText.textContent = message;
  running = false;
}

function restartGame() {
  options = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  running = true;
  cells.forEach(cell => (cell.textContent = ""));
  statusText.textContent = `${currentPlayer}'s turn`;
}

function makeComputerMove() {
  const bestMove = getBestMove();
  const cell = cells[bestMove.index];

  setTimeout(() => {
    updateCell(cell, bestMove.index);
    if (checkWinCondition()) {
      endGame(`${currentPlayer} wins!`);
    } else if (isBoardFull()) {
      endGame("It's a draw!");
    } else {
      currentPlayer = "X";
      statusText.textContent = `${currentPlayer}'s turn`;
    }
  }, 500);
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < cells.length; i++) {
    if (options[i] === "") {
      options[i] = "O";
      const score = minimax(options, 0, false);
      options[i] = "";

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return { index: bestMove };
}

const scores = {
  X: -1,
  O: 1,
  draw: 0
};

function minimax(board, depth, isMaximizing) {
  if (checkWinCondition()) {
    return scores[currentPlayer];
  } else if (isBoardFull()) {
    return scores.draw;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (options[i] === "") {
        options[i] = "O";
        const score = minimax(options, depth + 1, false);
        options[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < cells.length; i++) {
      if (options[i] === "") {
        options[i] = "X";
        const score = minimax(options, depth + 1, true);
        options[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

initializeGame();
