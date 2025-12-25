const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const scoreEl = document.getElementById('score');
const speedEl = document.getElementById('speed');
const finalScoreEl = document.getElementById('final-score');
const game = document.getElementById('game');
const runner = document.getElementById('runner');

let score = 0;
let speed = 6;
let isJumping = false;
let velocityY = 0;
let gravity = 0.5;
let obstacles = [];
let running = false;
let spawnTimer;

function startGame() {
  startScreen.classList.add('hidden');
  gameoverScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  game.innerHTML = '<div id="ground-line"></div>';
  game.appendChild(runner);
  runner.style.bottom = '48px';
  score = 0;
  speed = 6;
  obstacles = [];
  running = true;
  spawnTimer = 0;
  window.requestAnimationFrame(loop);
}

function endGame() {
  running = false;
  finalScoreEl.textContent = `Your score: ${score}`;
  gameScreen.classList.add('hidden');
  gameoverScreen.classList.remove('hidden');
}

function spawnObstacle() {
  const obs = document.createElement('div');
  obs.className = 'obstacle';
  obs.style.left = '100%';
  obs.dataset.speed = speed;
  game.appendChild(obs);
  obstacles.push(obs);
}

function jump() {
  if (isJumping) return;
  isJumping = true;
  velocityY = 10;
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (!running) startGame();
    else jump();
  }
});

document.getElementById('start-btn').onclick = startGame;
document.getElementById('retry-btn').onclick = startGame;

function loop(timestamp) {
  if (!running) return;

  score += 1;
  if (score % 300 === 0) speed = Math.min(14, speed + 1);
  scoreEl.textContent = score;
  speedEl.textContent = `${(speed / 6).toFixed(1)}x`;

  // spawn obstacles
  spawnTimer += 1;
  if (spawnTimer > 90 - speed * 3) {
    spawnObstacle();
    spawnTimer = 0;
  }

  // physics
  velocityY -= gravity;
  const currentBottom = parseFloat(runner.style.bottom);
  let nextBottom = currentBottom + velocityY;
  if (nextBottom <= 48) {
    nextBottom = 48;
    isJumping = false;
    velocityY = 0;
  }
  runner.style.bottom = `${nextBottom}px`;

  // move obstacles and detect collision
  const runnerRect = runner.getBoundingClientRect();
  obstacles.forEach((obs, index) => {
    const current = parseFloat(obs.style.left);
    obs.style.left = `${current - speed}px`;
    if (current < -40) {
      obs.remove();
      obstacles.splice(index, 1);
      return;
    }
    const obsRect = obs.getBoundingClientRect();
    const overlap = !(runnerRect.right < obsRect.left || runnerRect.left > obsRect.right || runnerRect.bottom < obsRect.top || runnerRect.top > obsRect.bottom);
    if (overlap) endGame();
  });

  window.requestAnimationFrame(loop);
}
