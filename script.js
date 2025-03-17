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
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);

    // If no cells make it through the filter,
    // the move is invalid. Stop execution.
    if (!availableCells.length) {
      console.log(`It's a Draw!-----------`);
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
    console.log(boardWithCellValues);
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
  let value = 0;

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
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
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
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
          brd[i][j + 3].getValue() === playerToken &&
          brd[i][j].getValue() === brd[i][j + 1].getValue() &&
          brd[i][j].getValue() === brd[i][j + 2].getValue() &&
          brd[i][j].getValue() === brd[i][j + 3].getValue()
        ) {
          console.log(`${getActivePlayer().name} Wins!`);
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
          brd[i + 3][j].getValue() === playerToken &&
          brd[i][j].getValue() === brd[i + 1][j].getValue() &&
          brd[i][j].getValue() === brd[i + 2][j].getValue() &&
          brd[i][j].getValue() === brd[i + 3][j].getValue()
        ) {
          console.log(`${getActivePlayer().name} Wins!`);
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
          brd[i + 3][j + 3].getValue() === playerToken &&
          brd[i][j].getValue() === brd[i + 1][j + 1].getValue() &&
          brd[i][j].getValue() === brd[i + 2][j + 2].getValue() &&
          brd[i][j].getValue() === brd[i + 3][j + 3].getValue()
        ) {
          console.log(`${getActivePlayer().name} Wins!`);
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
          brd[i + 3][j - 3].getValue() === playerToken &&
          brd[i][j].getValue() === brd[i + 1][j - 1].getValue() &&
          brd[i][j].getValue() === brd[i + 2][j - 2].getValue() &&
          brd[i][j].getValue() === brd[i + 3][j - 3].getValue()
        ) {
          console.log(`${getActivePlayer().name} Wins!`);
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
        if (cell.getValue() === 0) {
          return false;
        }
      }
    }
    return true;
  };

  const playRound = (column) => {
    // Drop a token for the current player
    console.log(
      `Dropping ${getActivePlayer().name}'s token into column ${column}...`
    );
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
  const game = GameController();

  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const resultDiv = document.querySelector(".result");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.dataset.column = index; // data-column
        cellButton.textContent = cell.getValue();
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
      resultDiv.textContent =
        roundResult.winner === "Draw"
          ? "It's a Draw!"
          : `${roundResult.winner} Wins!`;

      boardDiv.removeEventListener("click", clickHandlerEvent);
    }
  }
  boardDiv.addEventListener("click", clickHandlerEvent);

  updateScreen();
}

ScreenController();
