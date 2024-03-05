let board;
let screenWidth = window.screen.width;
let boardWidth = screenWidth > 400 ? 400 : screenWidth;
let boardHeight = 740;
let context;

//doodler
let doodlerWidth = 50;
let doodlerHeight = 50;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = boardHeight - doodlerHeight * 2;

let doodler = {
  width: doodlerWidth,
  height: doodlerHeight,
  x: doodlerX,
  y: doodlerY,
};

//physics
let velocityX = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  context.fillStyle = "red";
  context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height);

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveDoodlerX);
};

const update = () => {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);
  doodler.x += velocityX;
  if (doodler.x > boardWidth) {
    doodler.x = 0 - doodler.width;
  } else if (doodler.x + doodler.width < 0) {
    doodler.x = boardWidth;
  }
  context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height);
};

const moveDoodlerX = (e) => {
  if (e.code === "ArrowRight") {
    velocityX = 4;
  }
  if (e.code === "ArrowLeft") {
    velocityX = -4;
  }
};
