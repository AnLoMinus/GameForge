const levelEl = document.getElementById('level');
const xpEl = document.getElementById('xp');
const xpNeedEl = document.getElementById('xpNeed');
const goldEl = document.getElementById('gold');
const powerEl = document.getElementById('power');
const upgradeBtn = document.getElementById('upgrade');
const enemyEl = document.getElementById('enemy');
const hpBar = document.getElementById('hpBar');
const hpText = document.getElementById('hpText');

let level = 1;
let xp = 0;
let xpNeed = 30;
let gold = 0;
let power = 1;
let hp = 40;
let maxHp = hp;

function save() {
  const state = { level, xp, xpNeed, gold, power, hp, maxHp };
  localStorage.setItem('rpg-idle-mini', JSON.stringify(state));
}

function load() {
  const stored = localStorage.getItem('rpg-idle-mini');
  if (!stored) return;
  const data = JSON.parse(stored);
  level = data.level ?? level;
  xp = data.xp ?? xp;
  xpNeed = data.xpNeed ?? xpNeed;
  gold = data.gold ?? gold;
  power = data.power ?? power;
  hp = data.hp ?? hp;
  maxHp = data.maxHp ?? maxHp;
}

function updateUI() {
  levelEl.textContent = level;
  xpEl.textContent = xp;
  xpNeedEl.textContent = xpNeed;
  goldEl.textContent = gold;
  powerEl.textContent = power;
  hpText.textContent = `${hp} / ${maxHp}`;
  hpBar.style.width = `${(hp/maxHp)*100}%`;
  save();
}

function attack() {
  hp = Math.max(0, hp - power);
  if (hp === 0) {
    gold += 5;
    xp += 8;
    checkLevelUp();
    respawn();
  }
  updateUI();
}

function respawn() {
  maxHp = Math.round(maxHp * 1.1 + 5);
  hp = maxHp;
}

function checkLevelUp() {
  while (xp >= xpNeed) {
    xp -= xpNeed;
    level++;
    power++;
    xpNeed = Math.round(xpNeed * 1.25);
  }
}

function autoGold() {
  gold += 1;
  updateUI();
}

function upgrade() {
  if (gold < 25) return;
  gold -= 25;
  power += 2;
  updateUI();
}

enemyEl.addEventListener('click', attack);
upgradeBtn.addEventListener('click', upgrade);

load();
setInterval(autoGold, 1000);
updateUI();
