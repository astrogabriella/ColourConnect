// initialise the Page

let emptySquares = -1;
let gameGridArray = new Array(3); // inits new array each idx is a row

for (let i = 0; i < 3; i++) {
  gameGridArray[i] = new Array(3).fill(0); // add a new row of the length 3
}

function gameGridSetup(dim) {
  const gridBody = document.getElementById("mainBody");

  console.log(gridBody);

  for (let i = 0; i < dim ** 2; i++) {
    let square = document.createElement("div");
    square.classList.add("gameSquare");
    square.setAttribute("id", `square${i}`);
    square.setAttribute("onClick", "handlePlayerInput(event)");
    gridBody.appendChild(square);
  }

  emptySquares = dim ** 2;
}

window.addEventListener("DOMContentLoaded", () => {
  gameGridSetup(3);
});

// grid element 0 -> empty; 1 -> player 1; 2 -> player 2;

// if a player clicks on a button  it determines if a square is available and if availble it will fills it in with player colour
function handlePlayerInput(e) {
  let square = e.target;

  if (emptySquares % 2 == 1 && square.classList.contains("gameSquare")) {
    emptySquares -= 1;
    square.classList.remove("gameSquare");
    square.classList.add("gameSquarePlayer1");
    let cell = square.id[square.id.length - 1];
    console.log(cell);
    let [col, row] = setCellState(cell, 1);
    setTimeout(computerTurn, 1000);
  } else {
    console.log("square was taken");
  }
}

function computerTurn() {
while (true && emptySquares > 0)
{ 

  let cell = Math.floor(Math.random() * 9);
  console.log(cell);
  let square = document.getElementById(`square${cell}`);

  if (square.classList.contains("gameSquare")) {
    let [col, row] = setCellState(cell, 2);
    square.classList.remove("gameSquare");
    square.classList.add("gameSquarePlayer2");
    emptySquares -=1;
    return;
  } else {
    console.log("computer chose taken square");
  }
 }
}

function setCellState(cell, player) {
  let col = cell % 3;
  let row = Math.floor(cell / 3); // for cell 0-2 -> row 0; for cells 3-5 -> row 1; cells 6-8 -> row 2;
  gameGridArray[row][col] = player;
  console.log(col, row, `player: ${player}`);
  return [col, row];
}
