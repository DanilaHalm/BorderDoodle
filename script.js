let board;
let boardWidth = 370;
let boardHeight = 600;
let context;

window.onload = function() {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");
}

