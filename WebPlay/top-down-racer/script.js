const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const speedEl = document.getElementById('speed');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start');

const car = { x: canvas.width/2 - 20, y: canvas.height - 90, w: 40, h: 70 };
let obstacles = [];
let speed = 0;
let score = 0;
let playing = false;
let lastSpawn = 0;
let lastTime = 0;

function reset() {
  obstacles = [];
  speed = 40;
  score = 0;
  car.x = canvas.width/2 - 20;
}

function spawnObstacle() {
  const laneWidth = canvas.width / 3;
  const lane = Math.floor(Math.random()*3);
  obstacles.push({ x: laneWidth * lane + laneWidth/2 - 25, y: -70, w: 50, h: 70, speed: 2 + Math.random()*1.5 });
}

function update(time) {
  if (!playing) return;
  const delta = (time - lastTime) / 16;
  lastTime = time;

  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawRoad(delta);

  // Car
  ctx.fillStyle = '#5ce1e6';
  ctx.fillRect(car.x, car.y, car.w, car.h);

  // Obstacles
  if (time - lastSpawn > 900 - speed*4) { spawnObstacle(); lastSpawn = time; }
  obstacles.forEach(o => o.y += (speed/50 + o.speed) * delta);
  obstacles.forEach(o => {
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(o.x, o.y, o.w, o.h);
  });
  obstacles = obstacles.filter(o => o.y < canvas.height + 100);

  // Collision
  obstacles.forEach(o => {
    if (car.x < o.x + o.w && car.x + car.w > o.x && car.y < o.y + o.h && car.y + car.h > o.y) {
      playing = false;
      startBtn.textContent = 'שחק שוב';
    }
  });

  // Update HUD
  speed = Math.min(180, speed + 0.05 * delta);
  speedEl.textContent = Math.round(speed);
  score += 0.1 * speed * delta;
  scoreEl.textContent = Math.floor(score);

  requestAnimationFrame(update);
}

function drawRoad(delta) {
  ctx.fillStyle = '#1b2638';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = '#e4f1ff';
  const laneWidth = canvas.width / 3;
  for (let i=1;i<3;i++) {
    ctx.fillRect(laneWidth * i - 3, 0, 6, canvas.height);
  }
  // dashed center lines
  ctx.setLineDash([24, 16]);
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

window.addEventListener('keydown', e => {
  if (!playing) return;
  const laneWidth = canvas.width / 3;
  if (e.code === 'ArrowLeft') car.x = Math.max(10, car.x - laneWidth);
  if (e.code === 'ArrowRight') car.x = Math.min(canvas.width - car.w - 10, car.x + laneWidth);
});

startBtn.addEventListener('click', () => {
  reset();
  playing = true;
  lastTime = performance.now();
  lastSpawn = lastTime;
  startBtn.textContent = 'מאתחל...';
  requestAnimationFrame(update);
});
