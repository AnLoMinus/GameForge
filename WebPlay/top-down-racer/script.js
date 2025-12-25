const track = document.getElementById('track');
const car = document.getElementById('car');
const timeEl = document.getElementById('time');
const speedEl = document.getElementById('speed');
const startBtn = document.getElementById('start');
const overlay = document.getElementById('overlay');
const restartBtn = document.getElementById('restart');
const title = document.getElementById('title');
const desc = document.getElementById('desc');

let elapsed = 0;
let speed = 50;
let obstacles = [];
let active = false;
let timer;
let spawnTimer;

function setCar(x) {
  const clamped = Math.max(30, Math.min(track.clientWidth - 30, x));
  car.style.left = clamped + 'px';
}

function startTimers() {
  clearInterval(spawnTimer);
  spawnTimer = setInterval(spawnObstacle, Math.max(500, 1200 - elapsed * 10));
  timer = requestAnimationFrame(updateTime);
}

function updateTime(timestamp) {
  if (!active) return;
  elapsed += 0.016;
  timeEl.textContent = `Time: ${elapsed.toFixed(1)}s`;
  speed = 50 + elapsed * 4;
  speedEl.textContent = `Speed: ${Math.round(speed)} km/h`;
  moveObstacles();
  requestAnimationFrame(updateTime);
}

function spawnObstacle() {
  const obs = document.createElement('div');
  obs.className = 'obstacle';
  obs.style.left = Math.random() * (track.clientWidth - 60) + 'px';
  obs.style.top = '-80px';
  track.appendChild(obs);
  obstacles.push(obs);
}

function moveObstacles() {
  obstacles = obstacles.filter(obs => {
    const y = parseFloat(obs.style.top) + (2 + elapsed * 0.25);
    obs.style.top = y + 'px';
    if (y > track.clientHeight) { obs.remove(); return false; }
    if (collides(obs, car)) { endGame(); return false; }
    return true;
  });
}

function collides(a, b) {
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();
  return !(ra.right < rb.left || ra.left > rb.right || ra.bottom < rb.top || ra.top > rb.bottom);
}

function startGame() {
  obstacles.forEach(o => o.remove());
  obstacles = [];
  elapsed = 0;
  speed = 50;
  setCar(track.clientWidth / 2);
  active = true;
  overlay.classList.add('hidden');
  startTimers();
}

function endGame() {
  if (!active) return;
  active = false;
  clearInterval(spawnTimer);
  cancelAnimationFrame(timer);
  title.textContent = 'Crash!';
  desc.textContent = `You lasted ${elapsed.toFixed(1)}s at ${Math.round(speed)} km/h.`;
  overlay.classList.remove('hidden');
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
  if (['ArrowLeft','KeyA'].includes(e.code)) setCar(car.offsetLeft - 18);
  if (['ArrowRight','KeyD'].includes(e.code)) setCar(car.offsetLeft + 18);
});

track.addEventListener('mousemove', (e) => {
  const rect = track.getBoundingClientRect();
  setCar(e.clientX - rect.left);
});
