const field = document.getElementById('field');
const hitsEl = document.getElementById('hits');
const shotsEl = document.getElementById('shots');
const accuracyEl = document.getElementById('accuracy');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start');
const messageEl = document.getElementById('message');

let hits = 0;
let shots = 0;
let timer = 30;
let countdown;
let active = false;
let target;

function spawnTarget() {
  if (!active) return;
  if (target) target.remove();
  target = document.createElement('div');
  target.className = 'target';
  const { width, height } = field.getBoundingClientRect();
  const x = Math.random() * (width - 40) + 20;
  const y = Math.random() * (height - 40) + 20;
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  target.addEventListener('click', (e) => {
    e.stopPropagation();
    hits++;
    shots++;
    updateHUD();
    spawnTarget();
  });
  field.appendChild(target);
}

function startGame() {
  hits = 0;
  shots = 0;
  timer = 30;
  active = true;
  messageEl.textContent = '';
  updateHUD();
  spawnTarget();
  clearInterval(countdown);
  countdown = setInterval(() => {
    timer--;
    timeEl.textContent = timer;
    if (timer <= 0) endGame();
  }, 1000);
}

function endGame() {
  active = false;
  clearInterval(countdown);
  if (target) target.remove();
  messageEl.textContent = `סיום! פגעתם ${hits} פעמים בדיוק של ${accuracyEl.textContent}`;
}

function updateHUD() {
  hitsEl.textContent = hits;
  shotsEl.textContent = shots;
  const acc = shots === 0 ? 0 : Math.round((hits/shots)*100);
  accuracyEl.textContent = `${acc}%`;
  timeEl.textContent = timer;
}

startBtn.addEventListener('click', startGame);
field.addEventListener('click', () => {
  if (!active) return;
  shots++;
  updateHUD();
});
