const arena = document.getElementById('arena');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start');
const overlay = document.getElementById('overlay');
const title = document.getElementById('title');
const desc = document.getElementById('desc');
const againBtn = document.getElementById('again');

let projectiles = [];
let startTime = 0;
let running = false;
let spawnTimer;

function setPlayer(x, y) {
  const maxX = arena.clientWidth - 40;
  const maxY = arena.clientHeight - 40;
  player.style.left = Math.max(0, Math.min(maxX, x)) + 'px';
  player.style.top = Math.max(0, Math.min(maxY, y)) + 'px';
}

function spawn() {
  const proj = document.createElement('div');
  proj.className = 'projectile';
  const side = Math.floor(Math.random() * 4);
  let x, y, vx, vy;
  const speed = 2.5 + Math.random() * 1.5;
  if (side === 0) { x = Math.random() * arena.clientWidth; y = -20; vx = 0; vy = speed; }
  else if (side === 1) { x = arena.clientWidth + 20; y = Math.random() * arena.clientHeight; vx = -speed; vy = 0; }
  else if (side === 2) { x = Math.random() * arena.clientWidth; y = arena.clientHeight + 20; vx = 0; vy = -speed; }
  else { x = -20; y = Math.random() * arena.clientHeight; vx = speed; vy = 0; }
  proj.dataset.vx = vx;
  proj.dataset.vy = vy;
  proj.style.left = x + 'px';
  proj.style.top = y + 'px';
  arena.appendChild(proj);
  projectiles.push(proj);
}

function loop() {
  if (!running) return;
  const elapsed = (performance.now() - startTime) / 1000;
  scoreEl.textContent = `Time: ${elapsed.toFixed(1)}s`;
  projectiles = projectiles.filter(p => {
    const nx = parseFloat(p.style.left) + parseFloat(p.dataset.vx);
    const ny = parseFloat(p.style.top) + parseFloat(p.dataset.vy);
    p.style.left = nx + 'px';
    p.style.top = ny + 'px';
    if (nx < -40 || nx > arena.clientWidth + 40 || ny < -40 || ny > arena.clientHeight + 40) {
      p.remove();
      return false;
    }
    if (collides(p, player)) { end(); return false; }
    return true;
  });
  requestAnimationFrame(loop);
}

function collides(a, b) {
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();
  return !(ra.right < rb.left || ra.left > rb.right || ra.bottom < rb.top || ra.top > rb.bottom);
}

function start() {
  projectiles.forEach(p => p.remove());
  projectiles = [];
  setPlayer(arena.clientWidth / 2 - 20, arena.clientHeight / 2 - 20);
  startTime = performance.now();
  running = true;
  overlay.classList.add('hidden');
  clearInterval(spawnTimer);
  spawnTimer = setInterval(spawn, 600);
  loop();
}

function end() {
  running = false;
  clearInterval(spawnTimer);
  const elapsed = (performance.now() - startTime) / 1000;
  title.textContent = 'Hit!';
  desc.textContent = `You survived ${elapsed.toFixed(1)} seconds.`;
  overlay.classList.remove('hidden');
}

arena.addEventListener('mousemove', (e) => {
  const rect = arena.getBoundingClientRect();
  setPlayer(e.clientX - rect.left - 20, e.clientY - rect.top - 20);
});

startBtn.addEventListener('click', start);
againBtn.addEventListener('click', start);
