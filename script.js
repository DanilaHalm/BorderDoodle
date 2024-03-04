let board = document.getElementById("board");
let boardWidth = !(board.style.width % 2) ? board.style.width : board.style.width - 1;
let boardHeight = board.style.height;
let context;

window.onload = function() {
//  board = document.getElementById("board");
//  board.width = boardWidth;
//  board.height = boardHeight;
  context = board.getContext("2d");
}

