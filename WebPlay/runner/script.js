const playfield = document.getElementById('playfield');
const runner = document.getElementById('runner');
const scoreEl = document.getElementById('score');
const speedEl = document.getElementById('speed');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

let playing = false;
let speed = 1;
let score = 0;
let gravity = -0.35;
let velocityY = 0;
let isJumping = false;
let obstacles = [];
let lastSpawn = 0;
let lastTime = 0;

function resetGame() {
  obstacles.forEach(o => o.remove());
  obstacles = [];
  score = 0;
  speed = 1;
  velocityY = 0;
  runner.style.bottom = '70px';
  scoreEl.textContent = score;
  speedEl.textContent = speed.toFixed(1);
}

function spawnObstacle() {
  const obs = document.createElement('div');
  obs.className = 'obstacle';
  obs.style.right = '-40px';
  obs.style.height = `${40 + Math.random() * 40}px`;
  playfield.appendChild(obs);
  obstacles.push(obs);
}

function update(time) {
  if (!playing) return;
  const delta = time - lastTime;
  lastTime = time;

  // Runner physics
  const runnerBottom = parseFloat(runner.style.bottom);
  velocityY += gravity;
  const nextBottom = Math.max(70, runnerBottom + velocityY);
  runner.style.bottom = `${nextBottom}px`;
  if (nextBottom <= 70) {
    isJumping = false;
    velocityY = 0;
  }

  // Spawn obstacles
  if (time - lastSpawn > Math.max(600 - speed * 40, 260)) {
    spawnObstacle();
    lastSpawn = time;
  }

  // Move obstacles
  obstacles.forEach((obs, i) => {
    const currentRight = parseFloat(obs.style.right || '0');
    obs.style.right = `${currentRight + (4 + speed) }px`;

    const obsRect = obs.getBoundingClientRect();
    const runRect = runner.getBoundingClientRect();
    if (runRect.left < obsRect.right && runRect.right > obsRect.left && runRect.bottom > obsRect.top) {
      endGame();
    }

    if (obsRect.right < playfield.getBoundingClientRect().left) {
      obs.remove();
      obstacles.splice(i, 1);
      score += 10;
      scoreEl.textContent = score;
    }
  });

  // Increase speed gradually
  speed = Math.min(8, speed + 0.0008 * delta);
  speedEl.textContent = speed.toFixed(1);

  score += 0.05 * speed;
  scoreEl.textContent = Math.floor(score);

  requestAnimationFrame(update);
}

function endGame() {
  playing = false;
  overlay.classList.add('active');
  overlayTitle.textContent = 'Game Over';
  overlayText.textContent = `ניקוד סופי: ${Math.floor(score)}`;
}

function startGame() {
  resetGame();
  overlay.classList.remove('active');
  playing = true;
  lastTime = performance.now();
  lastSpawn = lastTime;
  requestAnimationFrame(update);
}

function jump() {
  if (!playing) return;
  if (!isJumping) {
    isJumping = true;
    velocityY = 8.5;
  }
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
window.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    jump();
  }
});
playfield.addEventListener('click', jump);

// Show intro overlay
overlay.classList.add('active');
overlayTitle.textContent = 'Runner אנרגטי';
overlayText.textContent = 'לחצו על התחל או מקש רווח כדי לרוץ ולקפוץ';
