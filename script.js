const ROWS = 6;
const COLS = 7;
const WIN_LENGTH = 4;

const boardElement = document.querySelector("#game-board");
const restartButton = document.querySelector("#restart-button");
const welcomeScreen = document.querySelector("#welcome-screen");
const gameScreen = document.querySelector("#game-screen");
const startButton = document.querySelector("#start-button");

const tokenImages = {
    red: "img/red.png",
    yellow: "img/yellow.png"
};

let board = [];
let currentPlayer = "red";
let gameOver = false;
let turnCount = 1;


// Start new game by creating an empty board
function initGame() {
    // Clears all previous data
    restartButton.hidden = true;
    turnCount = 1;
    updateTurnCount();
    gameOver = false;
    currentPlayer = "red";
    updateGameMessage();
    board = Array.from(
        { length: ROWS },
        () => Array(COLS).fill(null)
    );
    boardElement.replaceChildren();

    // Creates cells in html
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement("button");

            cell.classList.add("cell");
            cell.type = "button";
            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener("click", () => {
                playTurn(col);
            });

            boardElement.appendChild(cell);
        }
    }
}



// Insert a token in the column
function playTurn(col) {
    // Stops the game if a player has won
    if (gameOver) {
        return;
    }
    // Looks for the lowest cell in the column
    let row = ROWS - 1;

    while (row >= 0 && board[row][col] !== null) {
        row--;
    }

    // In case the column in full
    if (row < 0) {
        return;
    }

    board[row][col] = currentPlayer;

    // Displays the image of the token
    const cell = boardElement.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
    );

    const token = document.createElement("img");
    token.src = tokenImages[currentPlayer];
    token.alt = currentPlayer === "red"
        ? "red token"
        : "yellow token";
    token.classList.add("token");

    cell.appendChild(token);
    cell.setAttribute(
        "aria-label",
        `Row ${row + 1}, column ${col + 1}, token ${currentPlayer === "red" ? "rouge" : "jaune"
        }`
    );

    // Ends the game if the player has won
    if (checkWinner(row, col)) {
        gameOver = true;

        const message = document.querySelector("#turn-indicator");
        message.textContent =
            `${currentPlayer === "red" ? "Red" : "Yellow"} has won`;

        return;
    }


    switchPlayer();
}

// Displays the number of turns 
function updateTurnCount() {
    const counter = document.querySelector("#turn-count");
    counter.textContent = `Turn : ${turnCount}`;
}


// Switch the player after each action
function switchPlayer() {
    currentPlayer = currentPlayer === "red" ? "yellow" : "red";
    if (currentPlayer == "red") {
        turnCount++;
        updateTurnCount();
    }
    updateGameMessage();
}

function updateGameMessage() {
    const message = document.querySelector("#turn-indicator");

    message.textContent =
        currentPlayer === "red"
            ? "Now playing : RED"
            : "Now playing : YELLOW";
}


// Verifies if the token placed gives the victory to the player
function checkWinner(row, col) {
    const color = board[row][col];

    if (color === null) {
        return false;
    }

    // Directions
    const directions = [
        [0, 1],   // Horizontal
        [1, 0],   // Vertical
        [1, 1],   // Ascending Diagonal
        [1, -1]   // Descending Diagonal
    ];

    // dRow & dCol are the movement vertically or horizontally (d for delta)
    for (const [dRow, dCol] of directions) {
        let count = 1;

        // Checks in one direction
        count += countDirection(row, col, dRow, dCol, color);

        // Checks in the opposite direction
        count += countDirection(row, col, -dRow, -dCol, color);

        // Gives victory if 4 tokens are aligned
        if (count >= WIN_LENGTH) {
            restartButton.hidden = false;
            return true;
        }
    }

    return false;
}

// Counts the number of tokens in the given direction
function countDirection(row, col, dRow, dCol, color) {
    let count = 0;

    let r = row + dRow;
    let c = col + dCol;

    while (
        r >= 0 &&
        r < ROWS &&
        c >= 0 &&
        c < COLS &&
        board[r][c] === color
    ) {
        count++;
        r += dRow;
        c += dCol;
    }

    return count;
}


restartButton.addEventListener("click", initGame);

startButton.addEventListener("click", () => {
    welcomeScreen.hidden = true;
    gameScreen.hidden = false;

    initGame();
});