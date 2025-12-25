const arena = document.getElementById('arena');
const hitsEl = document.getElementById('hits');
const missesEl = document.getElementById('misses');
const accuracyEl = document.getElementById('accuracy');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start');
const overlay = document.getElementById('overlay');
const summary = document.getElementById('summary');
const againBtn = document.getElementById('again');

let hits = 0;
let misses = 0;
let timeLeft = 30;
let countdown;
let targetTimer;
let active = false;

function updateStats() {
  hitsEl.textContent = `Hits: ${hits}`;
  missesEl.textContent = `Misses: ${misses}`;
  const total = hits + misses;
  const accuracy = total ? Math.round((hits / total) * 100) : 0;
  accuracyEl.textContent = `Accuracy: ${accuracy}%`;
  timerEl.textContent = `Time: ${timeLeft}s`;
}

function spawnTarget() {
  if (!active) return;
  const target = document.createElement('div');
  target.className = 'target';
  target.textContent = '+' + Math.max(1, Math.floor(timeLeft / 5));
  const size = 54;
  const x = Math.random() * (arena.clientWidth - size);
  const y = Math.random() * (arena.clientHeight - size);
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  target.addEventListener('click', (e) => {
    e.stopPropagation();
    hits++;
    updateStats();
    target.remove();
  });
  arena.appendChild(target);
  setTimeout(() => target.remove(), 1300);
}

function startRound() {
  hits = 0;
  misses = 0;
  timeLeft = 30;
  active = true;
  overlay.classList.add('hidden');
  arena.innerHTML = '';
  updateStats();
  clearInterval(countdown);
  clearInterval(targetTimer);
  countdown = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) return endRound();
    updateStats();
  }, 1000);
  targetTimer = setInterval(spawnTarget, 700);
  spawnTarget();
}

function endRound() {
  active = false;
  clearInterval(countdown);
  clearInterval(targetTimer);
  const total = hits + misses || 1;
  const acc = Math.round((hits / total) * 100);
  summary.textContent = `Hits: ${hits}, Misses: ${misses}, Accuracy: ${acc}%`;
  overlay.classList.remove('hidden');
}

startBtn.addEventListener('click', startRound);
againBtn.addEventListener('click', startRound);
arena.addEventListener('click', () => { if (active) { misses++; updateStats(); } });
