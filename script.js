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
let platformHeight = 30;

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
  document.addEventListener("touchmove", touchMoveDoodlerX);
  document.addEventListener("touchend", touchStopDoodlerX);
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
  let platform;
  for (let i = 0; i < platformArray.length; i++) {
    platform = platformArray[i];
    if (doodler.y + doodler.height < (boardHeight * 1) / 5) {
      platform.y -= initialVelocity - 2;
    } else if (velocityY < -2 && doodler.y + doodler.height < (boardHeight * 3) / 4) {
      platform.y -= initialVelocity + 2;
      doodler.y += gravity;
    }
    if (doodler.y > 0 && checkCollision(doodler, platform) && velocityY > 4) {
      velocityY = initialVelocity;
    }
    context.fillRect(platform.x, platform.y, platform.width, platform.height);
    context.fillRect(0, (boardHeight * 3) / 4, boardWidth, 2);
  }

  //clear platforms and add new
  while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
    platformArray.shift();
    newPlatform();
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

const touchMoveDoodlerX = (e) => {
  [...e.changedTouches].map((touch,idx) => {
   // let isRight = touch.pageX > screenWidth / 2
    let isRight = touch.pageX > changedTouches[idx-1].pageX
    if(isRight) velocityX= 4
    else {
      velocityX = -4
    }
  })
}

const stopDoodlerX = (e) => {
  if (e.code? === "ArrowRight" || e.code? === "ArrowLeft") velocityX = 0;
};

const touchStopDoodlerX = (e) => {
  
  velocityX = 0
}

const placePlatforms = () => {
  platformArray = [];

  let platform = {
    x: boardWidth / 2 - doodlerWidth / 2,
    y: boardHeight - doodlerHeight,
    width: platformWidth,
    height: platformHeight,
  };
  platformArray.push(platform);

  for (let i = 0; i < 8; i++) {
    let randomX = Math.floor((Math.random() * boardWidth * 3) / 4);
    let platform = {
      x: randomX,
      y: boardHeight - 75 * i - 150,
      width: platformWidth,
      height: platformHeight,
    };
    platformArray.push(platform);
  }
};

const newPlatform = () => {
  let randomX = Math.floor((Math.random() * boardWidth * 3) / 4);
  let platform = {
    x: randomX,
    y: -platformHeight,
    width: platformWidth,
    height: platformHeight,
  };
  platformArray.push(platform);
};

const checkCollision = (firstElement, secondElement) => {
  return (
    firstElement.x < secondElement.x + secondElement.width &&
    firstElement.x + firstElement.width > secondElement.x &&
    firstElement.y < secondElement.y &&
    firstElement.y + firstElement.height > secondElement.y
  );
};
