const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');
const resetBtn = document.getElementById('reset');
const messageEl = document.getElementById('message');

let paddle = { w: 100, h: 14, x: canvas.width/2 - 50, y: canvas.height - 30 };
let ball = { x: canvas.width/2, y: canvas.height-50, r: 8, vx: 4, vy: -4 };
let bricks = [];
let cols = 8;
let rows = 4;
let brickW = (canvas.width - 60)/cols;
let brickH = 22;
let lives = 3;
let level = 1;
let running = true;

function buildBricks() {
  bricks = [];
  for (let r=0;r<rows;r++) {
    for (let c=0;c<cols;c++) {
      bricks.push({ x: 30 + c*brickW, y: 40 + r*brickH, hit: false, color: ["#8ecae6","#ff6b6b","#b5e48c"][r%3] });
    }
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = '#6de2ff';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
  ctx.fillStyle = '#ffd166';
  ctx.fill();

  bricks.forEach(b => {
    if (b.hit) return;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, brickW-6, brickH-6);
  });
}

function step() {
  if (!running) return;
  draw();
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.x < ball.r || ball.x > canvas.width - ball.r) ball.vx *= -1;
  if (ball.y < ball.r) ball.vy *= -1;

  if (ball.y > canvas.height - ball.r) loseLife();

  if (ball.x > paddle.x && ball.x < paddle.x + paddle.w && ball.y + ball.r > paddle.y) {
    ball.vy *= -1;
    const hitPos = (ball.x - paddle.x) / paddle.w - 0.5;
    ball.vx = hitPos * 10;
  }

  bricks.forEach(b => {
    if (b.hit) return;
    if (ball.x > b.x && ball.x < b.x + brickW-6 && ball.y > b.y && ball.y < b.y + brickH-6) {
      b.hit = true;
      ball.vy *= -1;
    }
  });

  if (bricks.every(b => b.hit)) {
    level++;
    levelEl.textContent = level;
    rows = Math.min(8, rows + 1);
    resetBall();
    buildBricks();
  }

  requestAnimationFrame(step);
}

function loseLife() {
  lives--;
  livesEl.textContent = lives;
  resetBall();
  if (lives <= 0) {
    running = false;
    messageEl.textContent = 'Game Over';
  }
}

function resetBall() {
  ball.x = canvas.width/2;
  ball.y = canvas.height - 50;
  ball.vx = 4 * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = -4;
}

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.w/2;
});
window.addEventListener('keydown', e => {
  if (e.code === 'ArrowLeft') paddle.x -= 24;
  if (e.code === 'ArrowRight') paddle.x += 24;
});

resetBtn.addEventListener('click', () => {
  lives = 3;
  level = 1;
  rows = 4;
  running = true;
  messageEl.textContent = '';
  livesEl.textContent = lives;
  levelEl.textContent = level;
  resetBall();
  buildBricks();
  requestAnimationFrame(step);
});

buildBricks();
requestAnimationFrame(step);
