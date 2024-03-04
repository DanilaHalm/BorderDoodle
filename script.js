let board = document.getElementById("board");
let boardWidth;
let boardHeight;
let context;

//doodler
let doodlerWidth = 50;
let doodlerHeight = 50;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight - doodlerHeight*2;

let doodler = {
  width: doodlerWidth,
  height: doodlerHeight,
  x: doodlerX,
  y: doodlerY,
}

window.onload = function() {
  board = document.getElementById("board");
  boardWidth = !(board.style.width % 2) ? board.style.width : board.style.width - 1;
  boardHeight = board.style.height;
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  context.fillStyle = "red";
  context.fillRect(doodler.x,doodler.y,doodler.width,doodler.height);
  
}

