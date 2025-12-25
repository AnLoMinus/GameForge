const arena = document.getElementById('arena');
const ship = document.getElementById('ship');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startBtn = document.getElementById('start');

let keys = { left: false, right: false, shoot: false };
let lasers = [];
let enemies = [];
let score = 0;
let lives = 3;
let running = false;
let spawnTimer = 0;

function reset() {
  lasers = [];
  enemies = [];
  score = 0;
  lives = 3;
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  arena.querySelectorAll('.laser, .enemy').forEach(el => el.remove());
  ship.style.left = '50%';
}

function spawnEnemy() {
  const enemy = document.createElement('div');
  enemy.className = 'enemy';
  enemy.style.left = `${Math.random() * 90 + 5}%`;
  enemy.style.top = '-30px';
  enemy.dataset.speed = (Math.random() * 1.5 + 1.5).toFixed(2);
  arena.appendChild(enemy);
  enemies.push(enemy);
}

function shoot() {
  const laser = document.createElement('div');
  laser.className = 'laser';
  const shipRect = ship.getBoundingClientRect();
  const arenaRect = arena.getBoundingClientRect();
  laser.style.left = `${shipRect.left - arenaRect.left + shipRect.width / 2 - 2}px`;
  laser.style.top = `${shipRect.top - arenaRect.top - 10}px`;
  arena.appendChild(laser);
  lasers.push(laser);
}

function loop() {
  if (!running) return;

  // move ship
  const currentLeft = parseFloat(ship.style.left);
  if (keys.left) ship.style.left = `${Math.max(2, currentLeft - 1)}%`;
  if (keys.right) ship.style.left = `${Math.min(98, currentLeft + 1)}%`;

  // spawn enemies
  spawnTimer += 1;
  if (spawnTimer > 50) {
    spawnEnemy();
    spawnTimer = Math.max(15, 60 - score / 4);
  }

  // move lasers
  lasers.forEach((laser, i) => {
    const y = parseFloat(laser.style.top);
    laser.style.top = `${y - 6}px`;
    if (y < -20) { laser.remove(); lasers.splice(i, 1); }
  });

  // move enemies
  enemies.forEach((enemy, i) => {
    const speed = parseFloat(enemy.dataset.speed) + score * 0.002;
    const y = parseFloat(enemy.style.top);
    enemy.style.top = `${y + speed}px`;
    if (y > arena.clientHeight) {
      enemy.remove();
      enemies.splice(i, 1);
      loseLife();
    }
  });

  detectCollisions();
  requestAnimationFrame(loop);
}

function detectCollisions() {
  const arenaRect = arena.getBoundingClientRect();
  const shipRect = ship.getBoundingClientRect();

  enemies.forEach((enemy, eIdx) => {
    const enemyRect = enemy.getBoundingClientRect();
    // ship collision
    const overlapShip = !(shipRect.right < enemyRect.left || shipRect.left > enemyRect.right || shipRect.bottom < enemyRect.top || shipRect.top > enemyRect.bottom);
    if (overlapShip) {
      enemy.remove();
      enemies.splice(eIdx, 1);
      loseLife();
    }

    // lasers
    lasers.forEach((laser, lIdx) => {
      const laserRect = laser.getBoundingClientRect();
      const overlap = !(laserRect.right < enemyRect.left || laserRect.left > enemyRect.right || laserRect.bottom < enemyRect.top || laserRect.top > enemyRect.bottom);
      if (overlap) {
        laser.remove();
        enemy.remove();
        lasers.splice(lIdx, 1);
        enemies.splice(eIdx, 1);
        score += 10;
        scoreEl.textContent = score;
      }
    });
  });
}

function loseLife() {
  lives -= 1;
  livesEl.textContent = lives;
  if (lives <= 0) {
    running = false;
    startBtn.textContent = 'Restart';
    startBtn.disabled = false;
  }
}

startBtn.addEventListener('click', () => {
  reset();
  running = true;
  startBtn.disabled = true;
  requestAnimationFrame(loop);
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') keys.left = true;
  if (e.code === 'ArrowRight') keys.right = true;
  if (e.code === 'Space') keys.shoot = true;
  if (e.code === 'Space' && running) shoot();
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') keys.left = false;
  if (e.code === 'ArrowRight') keys.right = false;
  if (e.code === 'Space') keys.shoot = false;
});
