const player = (name, marker) => {
  name, marker;

  let wins = 0;
  let viewWins = () => {
    return wins;
  };

  let wonRound = () => {
    wins++;
    fieldsInfo.updateFields();
  };

  let isWinner = () => {
    if (wins == 2) {
      return name;
    }
  };

  return { marker, wonRound, viewWins, isWinner };
};

const player1 = player("Player 1", "X");
const player2 = player("Player 2", "O");

const fieldsInfo = (() => {
  let p1Score = document.querySelector("#p1-score");
  let p2Score = document.querySelector("#p2-score");
  let message = document.querySelector(".message");

  const updateFields = () => {
    p1Score.textContent = player1.viewWins();
    p2Score.textContent = player2.viewWins();
  };

  return { updateFields };
})();

const gameBoard = (() => {
  const board = document.querySelectorAll(".box");
  let turn = player1.marker;
  const controller = new AbortController();

  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const checkWin = board => {
    for (let [a, b, c] of winConditions) {
      if (
        board[a].textContent &&
        board[a].textContent === board[b].textContent &&
        board[b].textContent === board[c].textContent
      ) {
        return board[a].textContent;
      }
    }
  };

  const resetGameBoard = () => {
    board.forEach(x => (x.textContent = ""));
  };

  const markBoard = x => {
    if (turn === "X") {
      x.textContent = "X";
      turn = player2.marker;
    } else {
      x.textContent = "O";
      turn = player1.marker;
    }
  };

  const stopListening = () => {
    board.forEach(x => {
      controller.abort();
    });
  };

  const playerWin = player => {
    player.wonRound();
    player.isWinner();
    stopListening();
  };

  const handleBoardClick = x => {
    markBoard(x);
    let winner = checkWin(board);
    if (winner === "X") {
      playerWin(player1);
    } else if (winner === "O") {
      playerWin(player2);
    }
  };

  const startListening = x => {
    x.addEventListener(
      "click",
      function handled() {
        handleBoardClick(x);
      },
      { signal: controller.signal, once: true }
    );
  };

  const runBoard = () => {
    board.forEach(x => {
      startListening(x);
    });
  };

  runBoard();
})();
