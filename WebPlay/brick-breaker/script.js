const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const resetBtn = document.getElementById('reset');

let paddle, ball, bricks, score, lives;

function init() {
  paddle = { x: canvas.width / 2 - 40, y: canvas.height - 20, w: 80, h: 12, speed: 6 };
  ball = { x: canvas.width / 2, y: canvas.height - 40, r: 8, vx: 3, vy: -3 };
  bricks = createBricks();
  score = 0;
  lives = 3;
  updateHUD();
}

function createBricks() {
  const rows = 5, cols = 10;
  const bricksArr = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      bricksArr.push({
        x: 20 + c * 60,
        y: 30 + r * 24,
        w: 52,
        h: 16,
        active: true,
        color: `hsl(${30 + r * 15}, 90%, 60%)`
      });
    }
  }
  return bricksArr;
}

function updateHUD() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // paddle
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  // ball
  ctx.beginPath();
  ctx.fillStyle = '#a855f7';
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();
  // bricks
  bricks.forEach(brick => {
    if (!brick.active) return;
    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
  });
}

function update() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // wall collisions
  if (ball.x < ball.r || ball.x > canvas.width - ball.r) ball.vx *= -1;
  if (ball.y < ball.r) ball.vy *= -1;

  // paddle collision
  if (ball.y + ball.r > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
    ball.vy *= -1;
    const hitPos = (ball.x - paddle.x) / paddle.w - 0.5;
    ball.vx = hitPos * 6;
  }

  // bottom
  if (ball.y > canvas.height) {
    lives -= 1;
    updateHUD();
    if (lives <= 0) {
      alert('Game over!');
      init();
      return;
    }
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 40;
    ball.vx = 3; ball.vy = -3;
  }

  // brick collisions
  bricks.forEach(brick => {
    if (!brick.active) return;
    if (ball.x > brick.x && ball.x < brick.x + brick.w && ball.y - ball.r < brick.y + brick.h && ball.y + ball.r > brick.y) {
      brick.active = false;
      ball.vy *= -1;
      score += 5;
      updateHUD();
    }
  });

  // win condition
  if (bricks.every(b => !b.active)) {
    alert('You cleared the wall!');
    init();
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.w / 2;
});

resetBtn.addEventListener('click', init);

init();
loop();
