let board;
let screenWidth = window.screen.width;
let boardWidth = screenWidth > 400 ? 400 : screenWidth;
let boardHeight = 720;
let context;

//doodler
let doodlerWidth = 70;
let doodlerHeight = 70;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = boardHeight - doodlerHeight * 2;
let doodlerSprite;

let doodlerStates = {
  ready: 0,
  starting: 279,
  jumping: 558,
  top: 837,
  startFall: 1116,
  falling: 1395,
  beforeFall: 1674,
  left: 0,
  right: 250,
};

let doodler = {
  img: null,
  state: "jumping",
  side: "left",
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

  doodlerSprite = new Image();
  doodlerSprite.src = "./assets/border-sprite.png";
  //УБРАТЬ ПО 45px со спрайта снизу и центра

  doodler.img = doodlerSprite;
  doodlerSprite.onload = function () {
    context.drawImage(
      doodler.img,
      doodlerStates[doodler.state],
      doodlerStates[doodler.side],
      279,
      250,
      doodler.x,
      doodler.y,
      doodler.width,
      doodler.height
    );
  };

  velocityY = initialVelocity;
  placePlatforms();
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveDoodlerX);
  document.addEventListener("keyup", stopDoodlerX);
  document.addEventListener("touchstart", touchMoveDoodlerX);
  document.addEventListener("touchend", touchStopDoodlerX);
  document.addEventListener("touchmove", touchMoveDoodlerX);
};

const update = () => {
  requestAnimationFrame(update);

  //doodler
  context.clearRect(0, 0, board.width, board.height);
  doodler.x += velocityX;
  velocityY += gravity;
  doodler.y += velocityY;

  // animation doodler
  if (velocityY > -8 && velocityY < -6) {
    doodler.state = "ready";
  } else if (velocityY > -6 && velocityY < -4) {
    doodler.state = "starting";
  } else if (velocityY > -4 && velocityY < -2) {
    doodler.state = "jumping";
  } else if (velocityY > -1 && velocityY < 1) {
    doodler.state = "top";
  } else if (velocityY > 1 && velocityY < 4) {
    doodler.state = "startFall";
  } else if (velocityY > 4 && velocityY < 6) {
    doodler.state = "falling";
  }

  if (doodler.x > boardWidth) {
    doodler.x = 0 - doodler.width;
  } else if (doodler.x + doodler.width < 0) {
    doodler.x = boardWidth;
  }
  context.drawImage(
    doodler.img,
    doodlerStates[doodler.state],
    doodlerStates[doodler.side],
    279,
    250,
    doodler.x,
    doodler.y,
    doodler.width,
    doodler.height
  );

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
    doodler.side = "right";
    velocityX = 4;
  }
  if (e.code === "ArrowLeft") {
    velocityX = -4;
    doodler.side = "left";
  }
};

const touchMoveDoodlerX = (e) => {
  let touch = [...e.changedTouches][0];
  let isRight = touch.pageX > boardWidth / 2;
  if (isRight) {
    velocityX = 4;
    doodler.side = "right";
  } else {
    velocityX = -4;
    doodler.side = "left";
  }
};

const stopDoodlerX = (e) => {
  if (e.code === "ArrowRight" || e.code === "ArrowLeft") velocityX = 0;
};

const touchStopDoodlerX = (e) => {
  velocityX = 0;
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
