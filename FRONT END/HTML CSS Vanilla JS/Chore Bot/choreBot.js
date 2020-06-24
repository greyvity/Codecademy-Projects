// Variables

let doorImage1 = document.querySelector("#door1");
let doorImage2 = document.querySelector("#door2");
let doorImage3 = document.querySelector("#door3");
let numClosedDoors = 3;
let openDoor1, openDoor2, openDoor3;
let closedDoorPath =
  "https://s3.amazonaws.com/codecademy-content/projects/chore-door/images/closed_door.svg";

let start = document.querySelector("#start");

let currentGameState = true;
// Random door generator

const randomDoorGenerator = () => {
  let chore = Math.floor(Math.random() * numClosedDoors);
  switch (chore) {
    case 0:
      openDoor1 = roboDoor;
      openDoor2 = beach;
      openDoor3 = space;
      break;
    case 1:
      openDoor1 = beach;
      openDoor2 = roboDoor;
      openDoor3 = space;
      break;
    default:
      openDoor1 = space;
      openDoor2 = beach;
      openDoor3 = roboDoor;
      break;
  }
};

//play game

const isBot = (door) => {
  if (door.src === roboDoor) {
    return true;
  } else {
    return false;
  }
};

const isClicked = (door) => {
  if (door.src === closedDoorPath) {
    return false;
  } else {
    return true;
  }
};

const playDoor = (door) => {
  numClosedDoors = numClosedDoors - 1;
  if (numClosedDoors === 0) {
    gameOver("win");
  } else if (isBot(door)) {
    gameOver();
  }
};

const startRound = () => {
  doorImage1.src = closedDoorPath;
  doorImage2.src = closedDoorPath;
  doorImage3.src = closedDoorPath;

  numClosedDoors = 3;
  currentGameState = true;

  start.innerHTML = "Good Luck!";

  randomDoorGenerator();
};

//door assignment on click.
let roboDoor =
  "https://s3.amazonaws.com/codecademy-content/projects/chore-door/images/robot.svg";

let beach =
  "https://s3.amazonaws.com/codecademy-content/projects/chore-door/images/beach.svg";

let space =
  "https://s3.amazonaws.com/codecademy-content/projects/chore-door/images/space.svg";

doorImage1.onclick = () => {
  if (currentGameState && !isClicked(doorImage1)) {
    doorImage1.src = openDoor1;
    playDoor(doorImage1);
  }
};

doorImage2.onclick = () => {
  if (currentGameState && !isClicked(doorImage2)) {
    doorImage2.src = openDoor2;
    playDoor(doorImage2);
  }
};

doorImage3.onclick = () => {
  if (currentGameState && !isClicked(doorImage3)) {
    doorImage3.src = openDoor3;
    playDoor(doorImage3);
  }
};

start.onclick = () => {
  startRound();
};

//game over

const gameOver = (status) => {
  if (status === "win") {
    start.innerHTML = "You win! Play Again?";
  } else {
    start.innerHTML = "You lose, Play Again?";
  }
  currentGameState = false;
};

randomDoorGenerator();
