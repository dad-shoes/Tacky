const gameBoard = (() => {
  let player = 1;
  const allBoxes = document.querySelectorAll(".box");
  const markBoard = x => {
    if (player === 1) {
      x.textContent = "X";
      player = 2;
    } else {
      x.textContent = "O";
      player = 1;
    }
    x.removeEventListener("click", () => markBoard(x));
    console.log("hey");
  };
  allBoxes.forEach(x => {
    x.addEventListener("click", () => markBoard(x));
  });
})();
