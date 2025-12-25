const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const speedEl = document.getElementById('speed');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

let isJumping = false;
let velocity = 0;
let gravity = 0.8;
let score = 0;
let speedMultiplier = 1;
let obstacleTimer;
let gameLoop;
let active = false;

function resetGame() {
  player.style.bottom = '24px';
  score = 0;
  speedMultiplier = 1;
  scoreEl.textContent = 'Score: 0';
  speedEl.textContent = 'Speed: 1x';
  [...document.querySelectorAll('.obstacle')].forEach(o => o.remove());
}

function jump() {
  if (isJumping || !active) return;
  isJumping = true;
  velocity = 13;
}

function spawnObstacle() {
  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.left = game.clientWidth + 'px';
  game.appendChild(obstacle);
  return obstacle;
}

function startObstacles() {
  obstacleTimer = setInterval(() => {
    const obstacle = spawnObstacle();
    const speed = (4 + speedMultiplier) * 1.6;
    const move = () => {
      if (!active) return;
      const left = parseFloat(obstacle.style.left) - speed;
      obstacle.style.left = left + 'px';
      if (left < -40) obstacle.remove();
      else requestAnimationFrame(move);
    };
    requestAnimationFrame(move);
  }, Math.max(900 - speedMultiplier * 60, 380));
}

function updateScore() {
  score += 1;
  if (score % 200 === 0) {
    speedMultiplier = Math.min(6, speedMultiplier + 0.6);
    speedEl.textContent = `Speed: ${speedMultiplier.toFixed(1)}x`;
  }
  scoreEl.textContent = 'Score: ' + score;
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  for (const obstacle of document.querySelectorAll('.obstacle')) {
    const rect = obstacle.getBoundingClientRect();
    const overlap = !(
      playerRect.right - 6 < rect.left ||
      playerRect.left + 6 > rect.right ||
      playerRect.bottom < rect.top + 10 ||
      playerRect.top > rect.bottom
    );
    if (overlap) return true;
  }
  return false;
}

function loop() {
  if (!active) return;
  if (isJumping) {
    const bottom = parseFloat(player.style.bottom);
    player.style.bottom = Math.max(24, bottom + velocity) + 'px';
    velocity -= gravity;
    if (bottom <= 24 && velocity < 0) {
      isJumping = false;
      player.style.bottom = '24px';
    }
  }
  updateScore();
  if (checkCollision()) return endGame();
  gameLoop = requestAnimationFrame(loop);
}

function startGame() {
  resetGame();
  active = true;
  overlay.classList.add('hidden');
  startObstacles();
  loop();
}

function endGame() {
  active = false;
  clearInterval(obstacleTimer);
  cancelAnimationFrame(gameLoop);
  overlayTitle.textContent = 'Game Over';
  overlayMessage.textContent = `Your score: ${score}. Tap restart to sprint again.`;
  overlay.classList.remove('hidden');
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!active) startGame();
    else jump();
  }
});
document.addEventListener('touchstart', () => {
  if (!active) startGame();
  else jump();
});
