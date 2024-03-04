let board;
let boardWidth = 350;
let boardHeight = 700;
let context;

window.onload = function() {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");
}

