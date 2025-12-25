const field = document.getElementById('field');
const hitsEl = document.getElementById('hits');
const shotsEl = document.getElementById('shots');
const accuracyEl = document.getElementById('accuracy');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start');

let hits = 0;
let shots = 0;
let timeLeft = 30;
let timer;
let target;

function spawnTarget() {
  if (target) target.remove();
  const size = 60;
  const x = Math.random() * (field.clientWidth - size);
  const y = Math.random() * (field.clientHeight - size);
  target = document.createElement('div');
  target.className = 'target';
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  target.addEventListener('click', (e) => {
    e.stopPropagation();
    hits += 1;
    updateStats();
    spawnTarget();
  });
  field.appendChild(target);
}

function updateStats() {
  hitsEl.textContent = hits;
  shotsEl.textContent = shots;
  const acc = shots ? Math.round((hits / shots) * 100) : 0;
  accuracyEl.textContent = `${acc}%`;
}

function startGame() {
  hits = 0;
  shots = 0;
  timeLeft = 30;
  updateStats();
  timeEl.textContent = timeLeft;
  clearInterval(timer);
  spawnTarget();
  timer = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  if (target) target.remove();
  alert(`Time! Accuracy: ${accuracyEl.textContent}`);
}

field.addEventListener('click', () => {
  shots += 1;
  updateStats();
});

startBtn.addEventListener('click', startGame);
