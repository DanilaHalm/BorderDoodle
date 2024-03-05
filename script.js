let board;
let screenWidth = window.screen.width;
let boardWidth = screenWidth > 400 ? 400 : screenWidth;
let boardHeight = 720;
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

//platforms
let platformArray = [];
let platformWidth = Math.floor(boardWidth / 5);
let platformHeight = 25;

//physics
let velocityX = 0;
let velocityY = 0;
let initialVelocity = -8;
let gravity = 0.2;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  context.fillStyle = "red";
  context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height);

  velocityY = initialVelocity;
  placePlatforms();
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveDoodlerX);
  document.addEventListener("keyup", stopDoodlerX);
};

const update = () => {
  requestAnimationFrame(update);

  //doodler
  context.clearRect(0, 0, board.width, board.height);
  doodler.x += velocityX;
  velocityY += gravity;
  doodler.y += velocityY;

  if (doodler.x > boardWidth) {
    doodler.x = 0 - doodler.width;
  } else if (doodler.x + doodler.width < 0) {
    doodler.x = boardWidth;
  }
  context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height);

  //platforms
  for (let i = 0; i < platformArray.length; i++) {
    let platform = platformArray[i];
    if (checkCollision(doodler, platform) && velocityY > 0) {
      velocityY = initialVelocity;
    }
    context.fillRect(platform.x, platform.y, platform.width, platform.height);
  }
};

const moveDoodlerX = (e) => {
  if (e.code === "ArrowRight") {
    velocityX = 4;
  }
  if (e.code === "ArrowLeft") {
    velocityX = -4;
  }
};

const stopDoodlerX = (e) => {
  if (e.code === "ArrowRight" || e.code === "ArrowLeft") velocityX = 0;
};

const placePlatforms = () => {
  platformArray = [];

  let platform = {
    x: boardWidth / 2 - doodlerWidth / 2,
    y: boardHeight - doodlerHeight,
    width: platformWidth,
    height: platformHeight,
  };
  platformArray.push(platform);

  platform = {
    x: doodlerWidth * 2,
    y: boardHeight - doodlerHeight - 150,
    width: platformWidth,
    height: platformHeight,
  };
  platformArray.push(platform);
};

const checkCollision = (firstElement, secondElement) => {
  return (
    firstElement.x < secondElement.x + secondElement.width &&
    firstElement.x + firstElement.width > secondElement.x &&
    firstElement.y < secondElement.y + secondElement.height &&
    firstElement.y + firstElement.height > secondElement.y
  );
};
