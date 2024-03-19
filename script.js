let board;
let screenWidth = window.screen.width;
let boardWidth = screenWidth > 400 ? 400 : screenWidth;
let boardHeight = 700;
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
  right: 205,
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
let platformWidth = Math.floor(boardWidth / 5) + 10;
let platformHeight = 45;
let platformSprite;
let platformStates = {
  idle: 0,
  scared: 356,
  angry: 712,
};
let angryTimer = 50;

//layers
let layersHeight = 2000;
let initialY = -(layersHeight - boardHeight);

let layer1 = {
  first: {
    img: null,
    speed: 7,
    y: initialY,
  },
  second: {
    img: null,
    speed: 7,
    y: initialY - layersHeight,
  },
};
let layer2 = {
  first: {
    img: null,
    speed: 5,
    y: initialY,
  },
  second: {
    img: null,
    speed: 5,
    y: initialY - layersHeight,
  },
};
let layer3 = {
  first: {
    img: null,
    speed: 3,
    y: initialY,
  },
  second: {
    img: null,
    speed: 3,
    y: initialY - layersHeight,
  },
};
let layers = [layer1, layer2, layer3];

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

  layer1Image = new Image();
  layer1Image.src = "./assets/layer-1.png";
  layer1.first.img = layer1Image;
  layer1.second.img = layer1Image;
  layer2Image = new Image();
  layer2Image.src = "./assets/layer-2.png";
  layer2.first.img = layer2Image;
  layer2.second.img = layer2Image;
  layer3Image = new Image();
  layer3Image.src = "./assets/layer-3.png";
  layer3.first.img = layer3Image;
  layer3.second.img = layer3Image;

  for (let i = 0; i < layers.length; i++) {
    let first = layers[i].first;
    let second = layers[i].second;

    context.drawImage(first.img, 0, first.y, boardWidth, 2000);
    context.drawImage(second.img, 0, second.y, boardWidth, 2000);
  }

  doodlerSprite = new Image();
  doodlerSprite.src = "./assets/border-sprite.png";

  doodler.img = doodlerSprite;
  doodlerSprite.onload = function () {
    context.drawImage(
      doodler.img,
      doodlerStates[doodler.state],
      doodlerStates[doodler.side],
      279,
      205,
      doodler.x,
      doodler.y,
      doodler.width,
      doodler.height
    );
  };

  platformSprite = new Image();
  platformSprite.src = "./assets/sheep-sprite.png";

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

  context.clearRect(0, 0, board.width, board.height);

  for (let i = 0; i < layers.length; i++) {
    let first = layers[i].first;
    let second = layers[i].second;

    context.drawImage(first.img, 0, first.y, boardWidth, 2000);
    context.drawImage(second.img, 0, second.y, boardWidth, 2000);
  }

  //doodler
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

  //layers
  for (let i = 0; i < layers.length; i++) {
    let first = layers[i].first;
    let second = layers[i].second;
    if (first.y >= boardHeight) first.y = initialY - layersHeight;
    if (second.y >= boardHeight) second.y = initialY - layersHeight;
    if (first.y > second.y && Math.abs(second.y - first.y) > layersHeight) {
      second.y = first.y - layersHeight;
    }
    if (second.y > first.y && Math.abs(first.y - second.y) > layersHeight) {
      first.y = second.y - layersHeight;
    }
  }

  //move doodler outside of board
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
    205,
    doodler.x,
    doodler.y,
    doodler.width,
    doodler.height
  );

  //platforms
  let platform;
  for (let i = 0; i < platformArray.length; i++) {
    platform = platformArray[i];
    //animation platform
    if (platform.state === "angry" && angryTimer > 0) {
      angryTimer -= 1;
    } else {
      if (
        doodler.y + doodler.height <= platform.y &&
        doodler.x + doodler.width > platform.x &&
        platform.x + platform.width > doodler.x
      ) {
        platform.state = "scared";
      } else {
        platform.state = "idle";
      }
    }

    // collision
    if (doodler.y + doodler.height < (boardHeight * 1) / 5) {
      if (i < layers.length) {
        layers[i].first.y -= initialVelocity - 2 + layers[i].first.speed;
        layers[i].second.y -= initialVelocity - 2 + layers[i].second.speed;
      }
      platform.y -= initialVelocity - 2;
    } else if (velocityY < -2 && doodler.y + doodler.height < (boardHeight * 3) / 4) {
      if (i < layers.length) {
        layers[i].first.y -= initialVelocity + layers[i].first.speed;
        layers[i].second.y -= initialVelocity + layers[i].second.speed;
      }
      platform.y -= initialVelocity + 2;
      doodler.y += gravity;
    }
    if (doodler.y > 0 && checkCollision(doodler, platform) && velocityY > 4) {
      velocityY = initialVelocity;
      platform.state = "angry";
      angryTimer = 50;
    }
    context.drawImage(
      platform.img,
      platformStates[platform.state],
      0,
      356,
      242,
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );
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
    img: platformSprite,
    state: "idle",
    x: boardWidth / 2 - doodlerWidth / 2,
    y: boardHeight - doodlerHeight,
    width: platformWidth,
    height: platformHeight,
  };
  platformArray.push(platform);

  for (let i = 0; i < 8; i++) {
    let randomX = Math.floor((Math.random() * boardWidth * 3) / 4);
    let platform = {
      img: platformSprite,
      state: "idle",
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
    img: platformSprite,
    state: "idle",
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
