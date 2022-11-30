const player = name => {
  const sayHi = () => {
    console.log(`Hi ${name}`);
  };
  return { sayHi };
};

const playersInfo = (() => {
  console.log("wut");
})();

const gameBoard = (() => {
  let player = 1;
  const board = document.querySelectorAll(".box");

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
    if (player === 1) {
      x.textContent = "X";
      player = 2;
    } else {
      x.textContent = "O";
      player = 1;
    }
  };

  board.forEach(x => {
    x.addEventListener(
      "click",
      () => {
        markBoard(x);
        let winner = checkWin(board);
        console.log(winner);
      },
      { once: true }
    );
  });
})();
