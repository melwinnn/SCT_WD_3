let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = 'player'; // Default mode is player vs player
let gameActive = true;
let gameInterval;

// Game board HTML
const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const homeButton = document.getElementById('home-button');

// Mode Selection HTML
const modeSelection = document.getElementById('mode-selection');
const vsComputerButton = document.getElementById('vs-computer');
const vsPlayerButton = document.getElementById('vs-player');

// Function to initialize the game grid
function createGrid() {
  boardElement.innerHTML = ''; // Clear the board
  board.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.dataset.index = index;
    cellElement.addEventListener('click', handleClick);
    boardElement.appendChild(cellElement);
  });
}

// Function to start the game
function startGame(mode) {
  gameMode = mode;
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusElement.textContent = "Player X's turn";
  createGrid();
  modeSelection.style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  homeButton.style.display = 'none';
  enableUserInput(); // Enable user input on start
}

// Function to handle user clicks
function handleClick(event) {
  const index = event.target.dataset.index;
  if (board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.style.pointerEvents = 'none'; // Disable clicking on the same cell

  checkWinner();
  switchPlayer();

  if (gameMode === 'computer' && currentPlayer === 'O' && gameActive) {
    setTimeout(computerMove, 500); // Delay for computer thinking effect
  }
}

// Function to switch player turns
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  if (gameActive) {
    statusElement.textContent = currentPlayer === 'X' ? "Player X's turn" : "Player O's turn";
  }
}

// Function to check if there's a winner
function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6] // Diagonal
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      statusElement.textContent = `Player ${currentPlayer} wins!`;
      homeButton.style.display = 'inline-block'; // Show home button when game is over
      return;
    }
  }

  if (!board.includes('')) {
    gameActive = false;
    statusElement.textContent = "It's a draw!";
    homeButton.style.display = 'inline-block'; // Show home button in case of draw
  }
}

// Minimax Algorithm to get the best move
function minimax(board, depth, isMaximizing) {
  const scores = {
    'X': -1,
    'O': 1,
    'draw': 0
  };

  if (checkGameOver(board)) {
    if (checkWinnerCondition(board, 'O')) return scores['O'];
    if (checkWinnerCondition(board, 'X')) return scores['X'];
    return scores['draw'];
  }

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = isMaximizing ? 'O' : 'X';
      const score = minimax(board, depth + 1, !isMaximizing);
      board[i] = '';
      bestScore = isMaximizing ? Math.max(bestScore, score) : Math.min(bestScore, score);
    }
  }

  return bestScore;
}

// Check if game is over (win or draw)
function checkGameOver(board) {
  return checkWinnerCondition(board, 'O') || checkWinnerCondition(board, 'X') || !board.includes('');
}

// Check if a player has won
function checkWinnerCondition(board, player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
}

// Computer move function with Minimax algorithm
function computerMove() {
  disableUserInput();

  let bestMove = null;
  let bestScore = -Infinity;

  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      const moveScore = minimax(board, 0, false);
      board[i] = ''; // Undo move

      if (moveScore > bestScore) {
        bestScore = moveScore;
        bestMove = i;
      }
    }
  }

  // Make the best move
  board[bestMove] = 'O';
  const cell = boardElement.querySelector(`[data-index='${bestMove}']`);
  cell.textContent = 'O';
  cell.style.pointerEvents = 'none'; // Disable clicking on the same cell

  checkWinner();
  switchPlayer();

  enableUserInput();
}

// Disable user input
function disableUserInput() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => cell.style.pointerEvents = 'none');
}

// Enable user input
function enableUserInput() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    if (cell.textContent === '') {
      cell.style.pointerEvents = 'auto';
    }
  });
}

// Reset Game Function
resetButton.addEventListener('click', () => startGame(gameMode));

// Go to Home Screen
homeButton.addEventListener('click', () => {
  modeSelection.style.display = 'block';
  document.getElementById('game-container').style.display = 'none';
  homeButton.style.display = 'none';
});

// Play Against Computer
vsComputerButton.addEventListener('click', () => startGame('computer'));

// Play Against Player
vsPlayerButton.addEventListener('click', () => startGame('player'));

// Initialize game mode selection screen
createGrid();
