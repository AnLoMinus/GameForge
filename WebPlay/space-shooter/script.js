const field = document.getElementById('field');
const ship = document.getElementById('ship');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startBtn = document.getElementById('start');
const overlay = document.getElementById('overlay');
const againBtn = document.getElementById('again');
const title = document.getElementById('title');
const message = document.getElementById('message');

let bullets = [];
let enemies = [];
let score = 0;
let lives = 3;
let active = false;
let spawnTimer;

function setShip(x) {
  const clamped = Math.max(22, Math.min(field.clientWidth - 22, x));
  ship.style.left = clamped + 'px';
}

function shoot() {
  if (!active) return;
  const rect = ship.getBoundingClientRect();
  const fieldRect = field.getBoundingClientRect();
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  bullet.style.left = rect.left - fieldRect.left + rect.width / 2 - 3 + 'px';
  bullet.style.top = rect.top - fieldRect.top - 16 + 'px';
  field.appendChild(bullet);
  bullets.push(bullet);
}

function spawnEnemy() {
  const enemy = document.createElement('div');
  enemy.className = 'enemy';
  enemy.style.left = Math.random() * (field.clientWidth - 40) + 'px';
  enemy.style.top = '-40px';
  field.appendChild(enemy);
  enemies.push(enemy);
}

function reset() {
  bullets.forEach(b => b.remove());
  enemies.forEach(e => e.remove());
  bullets = [];
  enemies = [];
  score = 0;
  lives = 3;
  scoreEl.textContent = 'Score: 0';
  livesEl.textContent = 'Lives: 3';
  setShip(field.clientWidth / 2);
}

function hitTest(a, b) {
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();
  return !(ra.right < rb.left || ra.left > rb.right || ra.bottom < rb.top || ra.top > rb.bottom);
}

function gameLoop() {
  if (!active) return;

  bullets = bullets.filter(b => {
    const y = parseFloat(b.style.top) - 8;
    if (y < -20) { b.remove(); return false; }
    b.style.top = y + 'px';
    return true;
  });

  enemies = enemies.filter(enemy => {
    const y = parseFloat(enemy.style.top) + 2.5;
    enemy.style.top = y + 'px';
    if (y > field.clientHeight) {
      enemy.remove();
      loseLife();
      return false;
    }
    return true;
  });

  bullets.forEach((bullet, bi) => {
    enemies.forEach((enemy, ei) => {
      if (hitTest(bullet, enemy)) {
        bullet.remove();
        enemy.remove();
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        addScore();
      }
    });
  });

  enemies.forEach((enemy, idx) => {
    if (hitTest(enemy, ship)) {
      enemy.remove();
      enemies.splice(idx, 1);
      loseLife();
    }
  });

  requestAnimationFrame(gameLoop);
}

function addScore() {
  score += 10;
  scoreEl.textContent = `Score: ${score}`;
}

function loseLife() {
  if (!active) return;
  lives -= 1;
  livesEl.textContent = `Lives: ${lives}`;
  if (lives <= 0) endGame();
}

function start() {
  reset();
  active = true;
  overlay.classList.add('hidden');
  clearInterval(spawnTimer);
  spawnTimer = setInterval(spawnEnemy, 900);
  requestAnimationFrame(gameLoop);
}

function endGame() {
  active = false;
  clearInterval(spawnTimer);
  title.textContent = 'Game Over';
  message.textContent = `Final score: ${score}`;
  overlay.classList.remove('hidden');
}

startBtn.addEventListener('click', start);
againBtn.addEventListener('click', start);

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); shoot(); }
  if (['ArrowLeft','KeyA'].includes(e.code)) setShip(ship.offsetLeft - 14);
  if (['ArrowRight','KeyD'].includes(e.code)) setShip(ship.offsetLeft + 14);
});

field.addEventListener('mousemove', (e) => {
  const rect = field.getBoundingClientRect();
  setShip(e.clientX - rect.left);
});
