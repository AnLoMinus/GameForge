const track = document.getElementById('track');
const car = document.getElementById('car');
const speedEl = document.getElementById('speed');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');

let speed = 40;
let score = 0;
let obstacles = [];
let running = true;
let startTime = performance.now();

function spawnLine(offset) {
  const line = document.createElement('div');
  line.className = 'lane-line';
  line.style.top = `${offset}px`;
  track.appendChild(line);
  return line;
}

const lines = [spawnLine(0), spawnLine(120), spawnLine(240), spawnLine(360)];

function spawnObstacle() {
  const obs = document.createElement('div');
  obs.className = 'obstacle';
  const lane = Math.floor(Math.random() * 3);
  obs.style.left = `${25 + lane * 25}%`;
  obs.style.top = '-30px';
  track.appendChild(obs);
  obstacles.push(obs);
}

function updateCar(dx) {
  const current = car.offsetLeft;
  car.style.left = `${Math.min(track.clientWidth - 40, Math.max(10, current + dx))}px`;
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') updateCar(-18);
  if (e.key === 'ArrowRight') updateCar(18);
});

document.addEventListener('touchmove', (e) => {
  const rect = track.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left;
  car.style.left = `${Math.min(rect.width - 30, Math.max(10, x))}px`;
});

let spawnTimer = 0;
function loop(now) {
  if (!running) return;
  const elapsed = (now - startTime) / 1000;
  timeEl.textContent = elapsed.toFixed(1);
  speedEl.textContent = Math.round(speed);
  scoreEl.textContent = score;

  spawnTimer += 1;
  if (spawnTimer > 50) {
    spawnObstacle();
    spawnTimer = Math.max(25, 60 - score / 2);
  }

  // move lines
  lines.forEach(line => {
    const y = parseFloat(line.style.top);
    line.style.top = `${y + speed * 0.25}px`;
    if (y > track.clientHeight) line.style.top = '-60px';
  });

  // move obstacles
  obstacles.forEach((obs, idx) => {
    const y = parseFloat(obs.style.top);
    obs.style.top = `${y + speed * 0.18}px`;
    if (y > track.clientHeight) {
      obs.remove();
      obstacles.splice(idx, 1);
      score += 5;
      speed += 2;
    }
  });

  detectCollisions();
  requestAnimationFrame(loop);
}

function detectCollisions() {
  const carRect = car.getBoundingClientRect();
  obstacles.forEach(obs => {
    const rect = obs.getBoundingClientRect();
    const overlap = !(carRect.right < rect.left || carRect.left > rect.right || carRect.bottom < rect.top || carRect.top > rect.bottom);
    if (overlap) {
      running = false;
      track.insertAdjacentHTML('beforeend', '<div class="hint" style="position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,0.4);font-weight:800;">Crash! Refresh to retry.</div>');
    }
  });
}

requestAnimationFrame(loop);
