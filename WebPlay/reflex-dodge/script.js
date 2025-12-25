const arena = document.getElementById('arena');
const player = document.getElementById('player');
const timeEl = document.getElementById('time');
const bestEl = document.getElementById('best');
const startBtn = document.getElementById('start');

let keys = {};
let bullets = [];
let running = false;
let startTime = 0;
let best = Number(localStorage.getItem('reflexBest') || 0);
let spawnTimer = 0;

bestEl.textContent = best.toFixed(1);

function startGame() {
  bullets.forEach(b => b.remove());
  bullets = [];
  running = true;
  startTime = performance.now();
  spawnTimer = 0;
  player.style.left = '50%';
  player.style.top = '50%';
  requestAnimationFrame(loop);
}

function endGame() {
  running = false;
  const survived = ((performance.now() - startTime) / 1000);
  if (survived > best) {
    best = survived;
    localStorage.setItem('reflexBest', best);
    bestEl.textContent = best.toFixed(1);
  }
}

function spawnBullet() {
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  const edge = Math.floor(Math.random() * 4);
  const pos = Math.random();
  if (edge === 0) { // top
    bullet.style.left = `${pos * 100}%`;
    bullet.style.top = '-8px';
    bullet.dataset.vx = (Math.random() - 0.5) * 2;
    bullet.dataset.vy = 2 + Math.random();
  } else if (edge === 1) { // right
    bullet.style.left = '100%';
    bullet.style.top = `${pos * 100}%`;
    bullet.dataset.vx = -(2 + Math.random());
    bullet.dataset.vy = (Math.random() - 0.5) * 2;
  } else if (edge === 2) { // bottom
    bullet.style.left = `${pos * 100}%`;
    bullet.style.top = '100%';
    bullet.dataset.vx = (Math.random() - 0.5) * 2;
    bullet.dataset.vy = -(2 + Math.random());
  } else { // left
    bullet.style.left = '-8px';
    bullet.style.top = `${pos * 100}%`;
    bullet.dataset.vx = 2 + Math.random();
    bullet.dataset.vy = (Math.random() - 0.5) * 2;
  }
  arena.appendChild(bullet);
  bullets.push(bullet);
}

function movePlayer() {
  const rect = arena.getBoundingClientRect();
  const x = player.offsetLeft;
  const y = player.offsetTop;
  const speed = 3.2;
  let nx = x;
  let ny = y;
  if (keys['ArrowLeft'] || keys['a']) nx -= speed;
  if (keys['ArrowRight'] || keys['d']) nx += speed;
  if (keys['ArrowUp'] || keys['w']) ny -= speed;
  if (keys['ArrowDown'] || keys['s']) ny += speed;
  nx = Math.max(0, Math.min(rect.width - player.clientWidth, nx));
  ny = Math.max(0, Math.min(rect.height - player.clientHeight, ny));
  player.style.left = `${nx}px`;
  player.style.top = `${ny}px`;
}

function loop(now) {
  if (!running) return;
  movePlayer();
  const elapsed = (now - startTime) / 1000;
  timeEl.textContent = elapsed.toFixed(1);

  spawnTimer += 1;
  if (spawnTimer > 25) {
    spawnBullet();
    spawnTimer = Math.max(10, 35 - elapsed);
  }

  const playerRect = player.getBoundingClientRect();
  bullets.forEach((b, idx) => {
    const vx = parseFloat(b.dataset.vx);
    const vy = parseFloat(b.dataset.vy);
    b.style.left = `${b.offsetLeft + vx}px`;
    b.style.top = `${b.offsetTop + vy}px`;
    const rect = b.getBoundingClientRect();
    const overlap = !(playerRect.right < rect.left || playerRect.left > rect.right || playerRect.bottom < rect.top || playerRect.top > rect.bottom);
    if (overlap) endGame();
    if (rect.right < 0 || rect.left > arena.clientWidth + 20 || rect.bottom < 0 || rect.top > arena.clientHeight + 20) {
      b.remove();
      bullets.splice(idx, 1);
    }
  });

  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });
startBtn.addEventListener('click', startGame);
