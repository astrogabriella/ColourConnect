// initialise the Page

let emptySquares = -1;
let gameGridArray = new Array(3); // inits new array each idx is a row
let gameOver = false;
let celTosSquareIdMap = new Map();

let computerMoves = [];
let playerMoves = [];

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
    celTosSquareIdMap.set(i, square);

    // points on the diagonal
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

  if (!gameOver && emptySquares % 2 == 1 && square.classList.contains("gameSquare")) {
    emptySquares -= 1;
    square.classList.remove("gameSquare");
    square.classList.add("gameSquarePlayer1");

    // adds to the play history
    playerMoves.push(square);
    let cell = square.id[square.id.length - 1];
    console.log(cell);
    let [col, row] = setCellState(cell, 1);

    if (hasPlayerWon(1, cell)) {
      playerMoves.forEach((sq) => sq.classList.add("gamePlayWon"));
      gameOver = true;
    }

    setTimeout(computerTurn, 1000);
    console.log(gameGridArray);
  } else {
    console.log("square was taken");
  }
}

function computerTurn() {
  while (!gameOver && emptySquares > 0) {
    let cell = Math.floor(Math.random() * 9);
    console.log(cell);
    let square = document.getElementById(`square${cell}`);

    // checks if
    if (square.classList.contains("gameSquare")) {
      let [col, row] = setCellState(cell, 2);
      // adds to the play history
      computerMoves.push(square);
      square.classList.remove("gameSquare");
      square.classList.add("gameSquarePlayer2");
      emptySquares -= 1;

      if (hasPlayerWon(2, cell)) {
        for (let i = 0; i < computerMoves.length; i++) {}

        computerMoves.forEach((sq) => sq.classList.add("gamePlayWon"));
        // handle Computer Victory
        gameOver = true;
      }

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

function hasPlayerWon(player, cell) {
  let col = cell % 3;
  let row = Math.floor(cell / 3);

  let winningList = [];

  // check all the squares in the same row
  let isCompleteRow = true;

  for (let i = 0; i < 3; i++) {
    if (gameGridArray[row][i] != player) {
      isCompleteRow = false;
      break;
    }
    winningList.push(celTosSquareIdMap.get(row*3+col))
  }
  if (isCompleteRow) {
    console.log("Winner", player);
    return true;
  }

  let isCompleteColumn = true;

  for (let i = 0; i < 3; i++) {
    // check all the squares in the same column
    if (gameGridArray[i][col] != player) {
      isCompleteColumn = false;
      break;
    }
    winningList.push(celTosSquareIdMap.get(row*3+col))
  }
  if (isCompleteColumn) {
    console.log("Winner", player);
    return true;
  }

  // check diagnonals

  // top left to bottom right will check if the diagonal passing through (row, col) can have a length of at least 3
  let aboveDiagonalLengthTLBR = Math.min(col, row);
  let belowDiagnonalLengthTLBR = Math.min(2 - col, 2 - row);

  if (aboveDiagonalLengthTLBR + belowDiagnonalLengthTLBR + 1 >= 3) {
    let c = checkDiagonals(col, row, true, player);
    console.log("diagonal:", c);
    if (c == 3){
      return true;
    }
  }

  // bottom left to top right will check if the antidiagonal passing through (row, col) can have a length of at least 3
  let aboveDiagonalLengthBLTR = Math.min(2 - col, row);
  let belowDiagnonalLengthBLTR = Math.min(col, 2 - row);

  if (aboveDiagonalLengthBLTR + belowDiagnonalLengthBLTR + 1 >= 3) {
    let c = checkDiagonals(col, row, false, player)
    console.log("antidiagonal:", c);
    if (c == 3){
      return true;
    }



  }

  return false;
}


// diag == true diagnonal diag == false antidiagonal
/*
This works like this starting from the (row, col) position check the cels left above and right below and in each iteration check one further 
*/
function checkDiagonals(col, row, diag, player) {
  let i = 1;
  let count = 1;
  let prev = 1;

  let continious1 = true;
  let continious2 = true;


  while (true) {
    if (diag) {
      // diagonal
      if ( continious1 &&
        col - i >= 0 &&
        row - i >= 0 &&
        gameGridArray[row - i][col - i] === player
      ) {
        count++;
      } else {

        continious1 = false;
      }

      if (continious2 &&
        col + i < gameGridArray.length &&
        row + i < gameGridArray.length &&
        gameGridArray[row + i][col + i] === player
      ) {
        count++;

      }else {

        continious2 = false;
      }
    }
    // same check but for the antidiagonal
    else {
      if ( continious1 &&
        col + i <= gameGridArray.length &&
        row - i >= 0 &&
        gameGridArray[row - i][col + i] === player
      ) {
        count++;
        continious1 = false;
      }
      if ( continious2 &&
        col - i >= 0 &&
        row + i < gameGridArray.length &&
        gameGridArray[row + i][col - i] === player
      ) {
        count++;
      } else {
        continious2 = false;
      }
    }
    if (prev == count){
      return count;
    }
 /** *
    if (i >= 3){
      console.log("error");
      return -1;
    }
*/
    prev = count;
    i++;
  }
}
