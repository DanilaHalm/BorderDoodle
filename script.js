let screen = windows.screen;
let board;
let boardWidth = Math.floor(screen.width);
let boardHeight = 600;
let context;

window.onload = function() {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");
}

