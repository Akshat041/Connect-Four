/*
 ** The Gameboard represents the state of the board
 ** Each square holds a Cell (defined later)
 ** and we expose a dropToken method to be able to add Cells to squares
 */

function Gameboard() {
  const rows = 6;
  const columns = 7;
  const board = [];

  // Create a 2d array that will represent the state of the game board
  // For this 2d array, row 0 will represent the top row and
  // column 0 will represent the left-most column.
  // This nested-loop technique is a simple and common way to create a 2d array.
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => board;

  // In order to drop a token, we need to find what the lowest point of the
  // selected column is, *then* change that cell's value to the player number
  const dropToken = (column, player) => {
    // Our board's outermost array represents the row,
    // so we need to loop through the rows, starting at row 0,
    // find all the rows that don't have a token, then take the
    // last one, which will represent the bottom-most empty cell
    const availableCells = board
      .filter((row) => row[column].getValue() === "white")
      .map((row) => row[column]);

    // If no cells make it through the filter,
    // the move is invalid. Stop execution.
    if (!availableCells.length) {
      return;
    }

    // Otherwise, I have a valid cell, the last one in the filtered array
    const lowestRow = availableCells.length - 1;
    board[lowestRow][column].addToken(player);
  };

  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play,
  // but we won't need it after we build our UI
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
  };

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return { getBoard, dropToken, printBoard };
}

/*
 ** A Cell represents one "square" on the board and can have one of
 ** 0: no token is in the square,
 ** 1: Player One's token,
 ** 2: Player 2's token
 */

function Cell() {
  let value = "white";

  // Accept a player's token to change the value of the cell
  const addToken = (color) => {
    value = color;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

/*
 ** The GameController will be responsible for controlling the
 ** flow and state of the game's turns, as well as whether
 ** anybody has won the game
 */
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: "red", // player 1's color
    },
    {
      name: playerTwoName,
      token: "yellow", // player 2's color
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
  };

  const checkWinner = () => {
    // for rows
    const brd = board.getBoard();
    const playerToken = getActivePlayer().token;

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          brd[i][j].getValue() === playerToken &&
          brd[i][j + 1].getValue() === playerToken &&
          brd[i][j + 2].getValue() === playerToken &&
          brd[i][j + 3].getValue() === playerToken
        ) {
          return { winner: getActivePlayer().name, isGameOver: true };
        }
      }
    }

    // for columns
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          brd[i][j].getValue() === playerToken &&
          brd[i + 1][j].getValue() === playerToken &&
          brd[i + 2][j].getValue() === playerToken &&
          brd[i + 3][j].getValue() === playerToken
        ) {
          return { winner: getActivePlayer().name, isGameOver: true };
        }
      }
    }

    // for left diagonals
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          brd[i][j].getValue() === playerToken &&
          brd[i + 1][j + 1].getValue() === playerToken &&
          brd[i + 2][j + 2].getValue() === playerToken &&
          brd[i + 3][j + 3].getValue() === playerToken
        ) {
          return { winner: getActivePlayer().name, isGameOver: true };
        }
      }
    }

    //for right diagonals
    for (let i = 0; i < 3; i++) {
      for (let j = 6; j >= 3; j--) {
        if (
          brd[i][j].getValue() === playerToken &&
          brd[i + 1][j - 1].getValue() === playerToken &&
          brd[i + 2][j - 2].getValue() === playerToken &&
          brd[i + 3][j - 3].getValue() === playerToken
        ) {
          return { winner: getActivePlayer().name, isGameOver: true };
        }
      }
    }
    return { winner: null, isGameOver: false };
  };

  const isDraw = () => {
    const brd = board.getBoard();
    for (let row of brd) {
      for (let cell of row) {
        if (cell.getValue() === "white") {
          return false;
        }
      }
    }
    return true;
  };

  const playRound = (column) => {
    // Drop a token for the current player
    board.dropToken(column, getActivePlayer().token);

    const winResult = checkWinner();

    if (winResult.isGameOver) {
      return winResult;
    }

    if (isDraw()) {
      return { winner: "Draw", isGameOver: true };
    }

    switchPlayerTurn();
    printNewRound();
    return { winner: null, isGameOver: false };
  };

  // Initial play game message
  printNewRound();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    checkWinner,
    isDraw,
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  let game;

  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const introDialog = document.querySelector("#introDialog");
  const introForm = document.querySelector("#introForm");

  const winnerDialog = document.querySelector("#winnerDialog");
  const playAgainBtn = document.querySelector("#playAgain");
  const winnerMessage = document.querySelector("#winnerMessage");
  const gameContainer = document.querySelector(".game-container");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cellBtn");
        cellButton.dataset.column = index; // data-column
        cellButton.style.backgroundColor = cell.getValue();
        cellButton.disabled = cell.getValue() !== "white"; // Disable if not white
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerEvent(e) {
    const selectedColumn = e.target.dataset.column;
    if (!selectedColumn) return;

    const roundResult = game.playRound(selectedColumn);
    updateScreen();

    if (roundResult.isGameOver) {
      winnerMessage.textContent =
        roundResult.winner === "Draw"
          ? "It's a Draw!"
          : `${roundResult.winner} Wins!`;

      winnerDialog.showModal();
      gameContainer.style.display = "none";

      boardDiv.removeEventListener("click", clickHandlerEvent);
    }
  }

  introDialog.showModal();

  introForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const player1Name = document.querySelector("#player1").value;
    const player2Name = document.querySelector("#player2").value;

    game = GameController(player1Name, player2Name);

    introDialog.close();

    gameContainer.style.display = "block";

    updateScreen();

    boardDiv.addEventListener("click", clickHandlerEvent);
  });

  playAgainBtn.addEventListener("click", () => {
    winnerDialog.close();
    introDialog.showModal();

    document.querySelector("#player1").value = "";
    document.querySelector("#player2").value = "";
  });

  document.getElementById("restartGame").addEventListener("click", () => {
    gameContainer.style.display = "none";
    introDialog.showModal();
    boardDiv.removeEventListener("click", clickHandlerEvent);
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";
  });
}

ScreenController();
