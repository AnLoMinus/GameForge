const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start');
const livesEl = document.getElementById('lives');
const scoreEl = document.getElementById('score');
const overlay = document.getElementById('overlay');

const ship = { x: canvas.width / 2, y: canvas.height - 60, size: 28, speed: 6 };
let bullets = [];
let enemies = [];
let lives = 3;
let score = 0;
let playing = false;
let lastSpawn = 0;
let lastTime = 0;

function reset() {
  bullets = [];
  enemies = [];
  lives = 3;
  score = 0;
  livesEl.textContent = lives;
  scoreEl.textContent = score;
  ship.x = canvas.width / 2;
}

function spawnEnemy() {
  enemies.push({ x: Math.random() * (canvas.width - 30) + 15, y: -20, size: 24, speed: 1.5 + Math.random()*1.5 });
}

function shoot() {
  if (!playing) return;
  bullets.push({ x: ship.x, y: ship.y - ship.size, speed: 7 });
}

function update(time) {
  if (!playing) return;
  const delta = time - lastTime;
  lastTime = time;

  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawShip();

  bullets = bullets.filter(b => b.y > -10);
  bullets.forEach(b => b.y -= b.speed);
  bullets.forEach(drawBullet);

  if (time - lastSpawn > 1000) {
    spawnEnemy();
    lastSpawn = time;
  }

  enemies.forEach(e => e.y += e.speed);
  enemies.forEach(drawEnemy);
  enemies = enemies.filter(e => e.y < canvas.height + 40);

  checkCollisions();

  requestAnimationFrame(update);
}

function drawShip() {
  ctx.fillStyle = '#6de2ff';
  ctx.beginPath();
  ctx.moveTo(ship.x, ship.y - ship.size);
  ctx.lineTo(ship.x - ship.size * 0.7, ship.y + ship.size);
  ctx.lineTo(ship.x + ship.size * 0.7, ship.y + ship.size);
  ctx.closePath();
  ctx.fill();
}

function drawBullet(b) {
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(b.x - 2, b.y, 4, 14);
}

function drawEnemy(e) {
  ctx.fillStyle = '#ff5d73';
  ctx.beginPath();
  ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
  ctx.fill();
}

function checkCollisions() {
  enemies.forEach((e, ei) => {
    // Ship hit
    const dist = Math.hypot(e.x - ship.x, e.y - ship.y);
    if (dist < e.size + ship.size * 0.7) {
      enemies.splice(ei,1);
      loseLife();
    }
    // Bullets hit
    bullets.forEach((b, bi) => {
      if (Math.abs(b.x - e.x) < e.size && Math.abs(b.y - e.y) < e.size) {
        enemies.splice(ei,1);
        bullets.splice(bi,1);
        score += 10;
        scoreEl.textContent = score;
      }
    });
  });
}

function loseLife() {
  lives--;
  livesEl.textContent = lives;
  if (lives <= 0) {
    playing = false;
    overlay.textContent = `Game Over | ניקוד ${score}`;
    overlay.classList.add('active');
  }
}

function startGame() {
  reset();
  overlay.classList.remove('active');
  playing = true;
  lastTime = performance.now();
  lastSpawn = lastTime;
  requestAnimationFrame(update);
}

startBtn.addEventListener('click', startGame);
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  ship.x = Math.min(canvas.width - 10, Math.max(10, x));
});
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); shoot(); }
  if (e.code === 'ArrowLeft') ship.x -= ship.speed;
  if (e.code === 'ArrowRight') ship.x += ship.speed;
});
canvas.addEventListener('click', shoot);

overlay.classList.add('active');
overlay.textContent = 'לחץ להתחיל ואז הזז את העכבר כדי לנוע, רווח לירי';
