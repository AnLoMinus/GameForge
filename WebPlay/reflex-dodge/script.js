const arena = document.getElementById('arena');
const player = document.getElementById('player');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start');
const messageEl = document.getElementById('message');

let bullets = [];
let playing = false;
let startTime = 0;
let lastSpawn = 0;
let anim;

function spawnBullet() {
  const side = Math.floor(Math.random()*4);
  const { width, height } = arena.getBoundingClientRect();
  let x,y, vx, vy;
  const speed = 1.5 + Math.random()*1.5;
  switch(side) {
    case 0: x = Math.random()*width; y = -10; vx = 0; vy = speed; break;
    case 1: x = width+10; y = Math.random()*height; vx = -speed; vy = 0; break;
    case 2: x = Math.random()*width; y = height+10; vx = 0; vy = -speed; break;
    default: x = -10; y = Math.random()*height; vx = speed; vy = 0;
  }
  bullets.push({ x, y, vx, vy });
}

function loop(timestamp) {
  if (!playing) return;
  const { width, height } = arena.getBoundingClientRect();
  if (timestamp - lastSpawn > 600) { spawnBullet(); lastSpawn = timestamp; }

  bullets.forEach(b => { b.x += b.vx; b.y += b.vy; });
  bullets = bullets.filter(b => b.x>-20 && b.x<width+20 && b.y>-20 && b.y<height+20);

  arena.querySelectorAll('.bullet').forEach(el => el.remove());
  bullets.forEach(b => {
    const el = document.createElement('div');
    el.className = 'bullet';
    el.style.left = `${b.x}px`;
    el.style.top = `${b.y}px`;
    arena.appendChild(el);
  });

  const px = parseFloat(player.style.left);
  const py = parseFloat(player.style.top);
  bullets.forEach(b => {
    const dx = b.x - px;
    const dy = b.y - py;
    if (Math.hypot(dx, dy) < 18) {
      endGame();
    }
  });

  const survival = ((timestamp - startTime)/1000).toFixed(1);
  timeEl.textContent = survival;
  anim = requestAnimationFrame(loop);
}

function endGame() {
  playing = false;
  cancelAnimationFrame(anim);
  messageEl.textContent = `נפלתם אחרי ${timeEl.textContent}s`; 
}

function startGame() {
  bullets = [];
  playing = true;
  startTime = performance.now();
  lastSpawn = startTime;
  messageEl.textContent = 'השתמשו בחיצים או WASD כדי לזוז';
  loop(startTime);
}

function movePlayer(dx, dy) {
  const rect = arena.getBoundingClientRect();
  const px = parseFloat(player.style.left);
  const py = parseFloat(player.style.top);
  const nx = Math.min(rect.width-8, Math.max(8, px + dx));
  const ny = Math.min(rect.height-8, Math.max(8, py + dy));
  player.style.left = `${nx}px`;
  player.style.top = `${ny}px`;
}

window.addEventListener('keydown', e => {
  const step = 10;
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') movePlayer(-step,0);
  if (e.code === 'ArrowRight' || e.code === 'KeyD') movePlayer(step,0);
  if (e.code === 'ArrowUp' || e.code === 'KeyW') movePlayer(0,-step);
  if (e.code === 'ArrowDown' || e.code === 'KeyS') movePlayer(0,step);
});

startBtn.addEventListener('click', startGame);
player.style.left = '50%';
player.style.top = '50%';
