const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start');
const restartBtn = document.getElementById('restart');
const overlay = document.getElementById('overlay');
const title = document.getElementById('title');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

let paddle, ball, bricks, score, lives, running, loopId;

function createBricks() {
  const rows = 5;
  const cols = 9;
  const padding = 8;
  const brickWidth = (canvas.width - padding * (cols + 1)) / cols;
  const brickHeight = 24;
  const blocks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      blocks.push({
        x: padding + c * (brickWidth + padding),
        y: 60 + r * (brickHeight + padding),
        w: brickWidth,
        h: brickHeight,
        color: `hsl(${120 + r * 25},70%,55%)`,
        alive: true,
      });
    }
  }
  return blocks;
}

function reset() {
  paddle = { x: canvas.width / 2 - 45, y: canvas.height - 28, w: 90, h: 14 };
  ball = { x: canvas.width / 2, y: canvas.height - 40, vx: 4, vy: -4, r: 8 };
  bricks = createBricks();
  score = 0;
  lives = 3;
  running = false;
  scoreEl.textContent = 'Score: 0';
  livesEl.textContent = 'Lives: 3';
  overlay.classList.add('hidden');
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = '#e2e8f0';
  ctx.fill();
  bricks.forEach(b => {
    if (!b.alive) return;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.w, b.h);
  });
}

function collideRectCircle(rect, circle) {
  const cx = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
  const cy = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
  const dx = circle.x - cx;
  const dy = circle.y - cy;
  return dx * dx + dy * dy < circle.r * circle.r;
}

function update() {
  if (!running) return;
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.vx *= -1;
  if (ball.y - ball.r < 0) ball.vy *= -1;
  if (ball.y - ball.r > canvas.height) loseLife();

  if (collideRectCircle(paddle, ball) && ball.vy > 0) {
    const hitPos = (ball.x - paddle.x) / paddle.w - 0.5;
    ball.vx = hitPos * 10;
    ball.vy *= -1;
  }

  bricks.forEach(b => {
    if (!b.alive) return;
    if (collideRectCircle({ x: b.x, y: b.y, w: b.w, h: b.h }, ball)) {
      b.alive = false;
      ball.vy *= -1;
      score += 10;
      scoreEl.textContent = `Score: ${score}`;
    }
  });

  if (bricks.every(b => !b.alive)) win();
  draw();
  loopId = requestAnimationFrame(update);
}

function loseLife() {
  lives -= 1;
  livesEl.textContent = `Lives: ${lives}`;
  if (lives <= 0) return gameOver();
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 40;
  ball.vy = -4;
  running = true;
}

function win() {
  running = false;
  overlay.classList.remove('hidden');
  title.textContent = 'Stage Clear!';
  text.textContent = `Score: ${score}`;
}

function gameOver() {
  running = false;
  overlay.classList.remove('hidden');
  title.textContent = 'Game Over';
  text.textContent = `Score: ${score}`;
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = Math.max(0, Math.min(canvas.width - paddle.w, e.clientX - rect.left - paddle.w / 2));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') paddle.x = Math.max(0, paddle.x - 12);
  if (e.key === 'ArrowRight') paddle.x = Math.min(canvas.width - paddle.w, paddle.x + 12);
});

startBtn.addEventListener('click', () => { running = true; update(); });
restartBtn.addEventListener('click', () => { reset(); running = true; update(); });

reset();
draw();
