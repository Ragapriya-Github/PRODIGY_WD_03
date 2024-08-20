const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const clickSound = document.getElementById('click-sound');
const celebration = document.getElementById('celebration');
let currentPlayer = 'X';
let board = Array(9).fill(null);
let gameActive = true;
let playerXName = 'Player X';
let playerOName = 'Player O';
let gameMode = 'pvp'; // Default mode

// Get player names
const playerXInput = document.getElementById('playerX');
const playerOInput = document.getElementById('playerO');

// Game mode buttons
const playerVsPlayerButton = document.getElementById('player-vs-player');
const playerVsAIButton = document.getElementById('player-vs-ai');

// Event Listeners for Game Mode Buttons
playerVsPlayerButton.addEventListener('click', () => {
    gameMode = 'pvp';
    resetGame();
    message.textContent = 'Player X\'s turn';
});

playerVsAIButton.addEventListener('click', () => {
    gameMode = 'pvai';
    resetGame();
    message.textContent = 'Player X\'s turn';
});

// Function to handle cell clicks
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.dataset.index;

        // If the cell is already filled or game is not active, return early
        if (board[index] || !gameActive) return;

        // Play click sound
        clickSound.play();

        // Player vs Player Mode
        if (gameMode === 'pvp') {
            handleMove(index);
        }

        // Player vs AI Mode
        if (gameMode === 'pvai') {
            handleMove(index); // Player's move

            if (gameActive) {
                setTimeout(() => aiMove(), 500); // AI's move with a slight delay
            }
        }
    });
});

// Function to handle Player move
function handleMove(index) {
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        const winnerName = currentPlayer === 'X' ? playerXName : playerOName;
        message.textContent = `${winnerName} wins!`;
        celebrateWin(winnerName); 
        gameActive = false;
    } else if (board.every(cell => cell !== null)) {
        message.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        message.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// AI Move Logic
function aiMove() {
    let availableCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);

    if (availableCells.length > 0) {
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        board[randomIndex] = 'O';
        cells[randomIndex].textContent = 'O';
        cells[randomIndex].classList.add('o');

        if (checkWin()) {
            message.textContent = `${playerOName} (AI) wins!`;
            celebrateWin(playerOName);
            gameActive = false;
        } else if (board.every(cell => cell !== null)) {
            message.textContent = "It's a draw!";
            gameActive = false;
        } else {
            currentPlayer = 'X';
            message.textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}

// Function to check for winning combinations
function checkWin() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winningCombos.some(combo => {
        return combo.every(index => board[index] === currentPlayer);
    });
}

// Celebrate the winning player
function celebrateWin(winnerName) {
    celebration.classList.remove('hidden');
    celebration.style.opacity = 1;
    celebration.innerHTML = `
        <div class="confetti"></div>
        <h2 class="winner-message">Congratulations, ${winnerName}!</h2>
    `;

    // Generate confetti
    for (let i = 0; i < 100; i++) {
        let confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        celebration.appendChild(confetti);
    }

    setTimeout(() => {
        celebration.style.opacity = 0;
        setTimeout(() => {
            celebration.classList.add('hidden');
            celebration.innerHTML = '';
        }, 500);
    }, 5000);
}

// Reset the game
resetButton.addEventListener('click', () => {
    resetGame();
});

// Reset Game Function
function resetGame() {
    board.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    currentPlayer = 'X';
    gameActive = true;
    message.textContent = `Player ${currentPlayer}'s turn`;
}
