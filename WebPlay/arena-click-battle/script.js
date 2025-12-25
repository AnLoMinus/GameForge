const bossEl = document.getElementById('boss');
const hpEl = document.getElementById('hp');
const barFill = document.getElementById('barFill');
const stageEl = document.getElementById('stage');
const powerEl = document.getElementById('power');
const goldEl = document.getElementById('gold');
const upgradeBtn = document.getElementById('upgrade');

let stage = 1;
let power = 1;
let gold = 0;
let hp = 50;
let maxHp = hp;

function updateUI() {
  hpEl.textContent = `${hp} / ${maxHp}`;
  barFill.style.width = `${(hp / maxHp) * 100}%`;
  stageEl.textContent = stage;
  powerEl.textContent = power;
  goldEl.textContent = gold;
}

function nextStage() {
  stage++;
  maxHp = Math.round(maxHp * 1.3 + 15);
  hp = maxHp;
  gold += 10;
  updateUI();
}

function attack() {
  hp = Math.max(0, hp - power);
  updateUI();
  if (hp === 0) {
    bossEl.classList.add('hit');
    setTimeout(() => bossEl.classList.remove('hit'), 120);
    nextStage();
  }
}

function upgrade() {
  if (gold < 20) return;
  gold -= 20;
  power++;
  updateUI();
}

bossEl.addEventListener('click', attack);
upgradeBtn.addEventListener('click', upgrade);

updateUI();
