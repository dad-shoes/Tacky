function player(name, marker) {
  // Player Factory Function that takes name & marker,
  // then generates a win tracker "wins" for each player created.
  name, marker;

  let wins = 0;

  let viewWins = () => {
    // viewWins prevents access directly to wins
    return wins;
  };

  function wonRound() {
    // wonRound adds a win to player wins
    wins++;
  }

  function isWinner() {
    // checks to see if player has met requirement
    // to win game
    if (wins == 3) {
      return name;
    }
  }

  return { marker, wonRound, viewWins, isWinner };
}

const player1 = player("Player 1", "X");
const player2 = player("Player 2", "O");

const gameBoard = (() => {
  // gameBoard obviously contains all logic for the board itself

  let board = document.querySelectorAll(".box");

  let turn = player1.marker;
  // turn keeps track of who's turn it is.
  // X will always go first. At least for the time being.

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
  // winConditions gives us an array of arrays
  // containing possible wins for the board
  // each number represents a space on the board 1-8

  const checkWin = board => {
    // uses forOf loop with destucturing of each win condition
    // if one letter takes all three spaces then that letter is returned
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
    // all spaces on board go back to blank
    board.forEach(x => (x.textContent = ""));
  };

  const markBoard = ({ target }) => {
    // destructures the event target in order to be able to
    // remove the event listener without passing the param
    // thus creating an anon func that is unremovable.
    // function also uses if statement to determine who's turn it is,
    // if X went last, it is now O's turn, thus changing the state of turn.
    if (turn === "X") {
      target.textContent = "X";
      turn = player2.marker;
    } else {
      target.textContent = "O";
      turn = player1.marker;
    }
  };

  const playerWin = player => {
    // essentially stops the round, incs winning players score,
    // updates the scores on screen, removes all event listeners,
    // and finally adds ability to move onto next round.
    // Also, if winner has been found then
    // stops game and displays newGame button
    player.wonRound();
    fieldsInfo.updateScore();
    stopListening();
    if (player.isWinner() !== undefined) {
      stopListening();
      fieldsInfo.gameOver(player);
    } else {
      fieldsInfo.nextRound();
    }
  };

  const handleBoardClick = event => {
    // determines the winner of the Board then calls play winner
    // this is where markBoard gets it's event from.
    markBoard(event);
    let winner = checkWin(board);
    if (winner === "X") {
      playerWin(player1);
    } else if (winner === "O") {
      playerWin(player2);
    }
  };

  const startListening = x => {
    // addEventListener
    x.addEventListener("click", handleBoardClick, {
      once: true,
    });
  };

  const stopListening = () => {
    // remove event listener
    board.forEach(x => {
      x.removeEventListener("click", handleBoardClick, {
        once: true,
      });
    });
  };

  const runBoard = () => {
    // adds the event listeners to each space on the board
    board.forEach(x => {
      startListening(x);
    });
  };

  const runAgain = () => {
    // adds event listeners back to the spaces
    // for next round and sets the turn back to "X"
    resetGameBoard();
    runBoard();
    turn = player1.marker;
  };

  runBoard();

  return { runAgain, turn };
})();

const fieldsInfo = (() => {
  // keeps track of messages below the board and
  // the players score displays
  let p1Score = document.querySelector("#p1-score");
  let p2Score = document.querySelector("#p2-score");
  let messageDiv = document.querySelector("#message");
  let message = document.querySelector(".message");

  let nextRoundButton = document.createElement("button");
  // moves us to the next round.
  nextRoundButton.classList.add("btn", "btn-secondary");
  nextRoundButton.textContent = "Next Round";
  nextRoundButton.addEventListener("click", () => {
    gameBoard.runAgain();
    nextRoundButton.remove();
    message = document.createElement("h2");
    message.textContent = "Game Time!";
    messageDiv.append(message);
  });

  let playAgainButton = document.createElement("button");
  playAgainButton.classList.add("btn", "btn-secondary");
  playAgainButton.textContent = "Play Again?";
  playAgainButton.addEventListener("click", () => {
    document.location.reload();
  });

  const updateScore = () => {
    // updates score displays
    p1Score.textContent = player1.viewWins();
    p2Score.textContent = player2.viewWins();
  };

  const nextRound = () => {
    // removes the message and adds the next round button
    // below the board
    message.remove();
    messageDiv.append(nextRoundButton);
  };

  const gameOver = player => {
    // displays winner and displays playAgain button
    let winner = player.isWinner();
    message.textContent = `${winner} Won! Congrats ${winner}!`;
    messageDiv.append(playAgainButton);
  };

  return { nextRoundButton, updateScore, nextRound, gameOver };
})();
