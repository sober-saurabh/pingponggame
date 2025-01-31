// DOM Elements
const container = document.querySelector(".game-container");
const topRod = document.getElementById("top-rod");
const bottomRod = document.getElementById("bottom-rod");
const ball = document.getElementById("ball");
const levelDisplay = document.getElementById("level");
const currentScoreDisplay = document.getElementById("current-score");
const highScoreDisplay = document.getElementById("high-score");

// Create Notification Element
const notification = document.createElement("div");
notification.id = "notification";
document.body.appendChild(notification);

// Game Variables
let ballDirection = { x: 2, y: 2 };
let topRodX = 50;
let bottomRodX = 50;
let ballX = 50;
let ballY = 50;
let score = 0;
let level = 1;
let ballSpeed = 0.4;
let gameInterval = null;
let lastLosingRod = null;

const ROD_SPEED = 5;
const MAX_BALL_SPEED = 2.0;
const BASE_CHASING_SCORE = 30;

// Load High Score from Local Storage
const highScore = localStorage.getItem("highScore") || 0;
const highScorer = localStorage.getItem("highScorer") || "No one";
highScoreDisplay.textContent = `${highScore} by ${highScorer}`;

// Alert Welcome Message
alert(
  `Welcome to Ping Pong!\nHighest Score: ${highScore} by ${highScorer}.\nUse 'A' and 'D' keys to move the rods. Press 'Space bar' to start!`
);

// Start Game
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !gameInterval) {
    resetGame(false);
    gameInterval = setInterval(gameLoop, 16);
  }
});

// Move Rods
document.addEventListener("keydown", (e) => {
  if (e.key === "a" || e.key === "ArrowLeft") {
    topRodX = Math.max(7, topRodX - ROD_SPEED);
    bottomRodX = Math.max(7, bottomRodX - ROD_SPEED);
  } else if (e.key === "d" || e.key === "ArrowRight") {
    topRodX = Math.min(100 - 7, topRodX + ROD_SPEED);
    bottomRodX = Math.min(100 - 7, bottomRodX + ROD_SPEED);
  }

  topRod.style.left = `${topRodX}%`;
  bottomRod.style.left = `${bottomRodX}%`;
});

// Game Loop
function gameLoop() {
  ballX += ballDirection.x;
  ballY += ballDirection.y;

  // Ball Collision with Walls
  if (ballX <= 0 || ballX >= 100) {
    ballDirection.x = -ballDirection.x;
  }

  // Ball Collision with Rods
  const ballRect = ball.getBoundingClientRect();
  const topRodRect = topRod.getBoundingClientRect();
  const bottomRodRect = bottomRod.getBoundingClientRect();

  if (
    ballRect.bottom >= bottomRodRect.top &&
    ballRect.right >= bottomRodRect.left &&
    ballRect.left <= bottomRodRect.right
  ) {
    ballDirection.y = -ballSpeed;
    score++;
    lastLosingRod = "top";
    checkLevelUp();
  } else if (
    ballRect.top <= topRodRect.bottom &&
    ballRect.right >= topRodRect.left &&
    ballRect.left <= topRodRect.right
  ) {
    ballDirection.y = ballSpeed;
    score++;
    lastLosingRod = "bottom";
    checkLevelUp();
  }

  // Ball Out of Bounds
  if (ballY <= 0 || ballY >= 100) {
    endGame();
  }

  ball.style.left = `${ballX}%`;
  ball.style.top = `${ballY}%`;
}

// Check for Level Up
function checkLevelUp() {
  const chasingScore = BASE_CHASING_SCORE + (level - 1) * 50;

  if (score >= chasingScore) {
    level++;
    ballSpeed = Math.min(ballSpeed + 0.2, MAX_BALL_SPEED);
    levelDisplay.textContent = level;

    // Show Notification
    showNotification(`Level Up! Welcome to Level ${level}. Ball Speed: ${ballSpeed.toFixed(1)}`);
  }
  currentScoreDisplay.textContent = score;
}

// Show Notification
function showNotification(message) {
  notification.textContent = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
}

// Reset Game
function resetGame(isNewGame) {
  ballX = 50;
  ballY = 50;
  ballDirection = lastLosingRod === "top" ? { x: ballSpeed, y: -ballSpeed } : { x: ballSpeed, y: ballSpeed };
  topRodX = 50;
  bottomRodX = 50;

  if (isNewGame) {
    score = 0;
    level = 1;
    ballSpeed = 0.4;
    levelDisplay.textContent = level;
  }

  topRod.style.left = `${topRodX}%`;
  bottomRod.style.left = `${bottomRodX}%`;
  ball.style.left = `${ballX}%`;
  ball.style.top = `${ballY}%`;
}

// End Game
function endGame() {
  clearInterval(gameInterval);
  gameInterval = null;

  alert(`Game Over! Your Score: ${score}`);

  if (score > highScore) {
    const playerName = prompt("New High Score! Enter your name:");
    localStorage.setItem("highScore", score);
    localStorage.setItem("highScorer", playerName || "Anonymous");
  }

  resetGame(true);
}
