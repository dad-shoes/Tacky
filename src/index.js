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
  let nextRoundButton = document.createElement("button");
  nextRoundButton.classList.add("btn", "btn-secondary");
  nextRoundButton.textContent = "Next Round";
  let p1Score = document.querySelector("#p1-score");
  let p2Score = document.querySelector("#p2-score");
  let messageDiv = document.querySelector("#message");
  let messageBox = document.querySelector(".message");

  const updateFields = () => {
    p1Score.textContent = player1.viewWins();
    p2Score.textContent = player2.viewWins();
  };

  const nextRound = () => {
    messageBox.remove();
    messageDiv.append(nextRoundButton);
  };

  nextRoundButton.addEventListener("click", gameBoard.runAgain);

  return { nextRoundButton, updateFields, nextRound };
})();

const gameBoard = (() => {
  let board = document.querySelectorAll(".box");
  let turn = player1.marker;

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

  const markBoard = ({ target }) => {
    if (turn === "X") {
      target.textContent = "X";
      turn = player2.marker;
    } else {
      target.textContent = "O";
      turn = player1.marker;
    }
  };

  const playerWin = player => {
    player.wonRound();
    player.isWinner();
    stopListening();
    fieldsInfo.nextRound();
  };

  const handleBoardClick = event => {
    markBoard(event);
    let winner = checkWin(board);
    if (winner === "X") {
      playerWin(player1);
    } else if (winner === "O") {
      playerWin(player2);
    }
  };

  const startListening = x => {
    x.addEventListener("click", handleBoardClick, {
      once: true,
    });
  };

  const stopListening = () => {
    board.forEach(x => {
      x.removeEventListener("click", handleBoardClick, {
        once: true,
      });
    });
  };

  const runBoard = () => {
    board.forEach(x => {
      startListening(x);
    });
  };

  const runAgain = () => {
    resetGameBoard();
    runBoard();
    turn = player1.marker;
  };

  runBoard();

  return { runAgain };
})();
