const levelEl = document.getElementById('level');
const goldEl = document.getElementById('gold');
const dpsEl = document.getElementById('dps');
const enemyName = document.getElementById('enemyName');
const hpFill = document.getElementById('hpFill');
const enemyHpText = document.getElementById('enemyHp');
const strikeBtn = document.getElementById('strike');
const strikeInfo = document.getElementById('strikeInfo');
const buyStrike = document.getElementById('buyStrike');
const dpsInfo = document.getElementById('dpsInfo');
const buyDps = document.getElementById('buyDps');
const saveBtn = document.getElementById('save');

let level = 1;
let gold = 0;
let clickDamage = 3;
let dps = 1;
let enemyHp = 20;
let currentHp = enemyHp;
let ticker;

function saveProgress() {
  const data = { level, gold, clickDamage, dps, enemyHp, currentHp };
  localStorage.setItem('rpg-idle', JSON.stringify(data));
}

function loadProgress() {
  const raw = localStorage.getItem('rpg-idle');
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    level = data.level || level;
    gold = data.gold || gold;
    clickDamage = data.clickDamage || clickDamage;
    dps = data.dps || dps;
    enemyHp = data.enemyHp || enemyHp;
    currentHp = data.currentHp || currentHp;
  } catch (e) {
    console.warn('save corrupted');
  }
}

function updateUI() {
  levelEl.textContent = `Level ${level}`;
  goldEl.textContent = `Gold: ${Math.floor(gold)}`;
  dpsEl.textContent = `DPS: ${dps}`;
  hpFill.style.width = `${(currentHp / enemyHp) * 100}%`;
  enemyHpText.textContent = `HP: ${Math.max(0, Math.floor(currentHp))}`;
  strikeInfo.textContent = `Click Damage: ${clickDamage}`;
  dpsInfo.textContent = `DPS: ${dps}`;
}

function strike(dmg) {
  currentHp -= dmg;
  if (currentHp <= 0) {
    gold += 10 + level * 2;
    level++;
    enemyHp = Math.floor(enemyHp * 1.35 + 10);
    currentHp = enemyHp;
    enemyName.textContent = level % 5 === 0 ? 'Boss Shade' : 'Wandering Foe';
    saveProgress();
  }
  updateUI();
}

function startTicker() {
  clearInterval(ticker);
  ticker = setInterval(() => {
    gold += dps * 0.25;
    strike(dps * 0.25);
    updateUI();
  }, 250);
}

strikeBtn.addEventListener('click', () => strike(clickDamage));

buyStrike.addEventListener('click', () => {
  const cost = 15 + clickDamage * 4;
  if (gold >= cost) {
    gold -= cost;
    clickDamage += 2;
    updateUI();
    saveProgress();
  }
});

buyDps.addEventListener('click', () => {
  const cost = 25 + dps * 6;
  if (gold >= cost) {
    gold -= cost;
    dps += 1;
    updateUI();
    saveProgress();
  }
});

saveBtn.addEventListener('click', saveProgress);

loadProgress();
updateUI();
startTicker();
