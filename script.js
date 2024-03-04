let board;
let boardWidth = 400;
let boardHeight = 500;
let context;

window.onload = function() {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");
}

