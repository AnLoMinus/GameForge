const levelEl = document.getElementById('level');
const xpEl = document.getElementById('xp');
const xpCapEl = document.getElementById('xp-cap');
const goldEl = document.getElementById('gold');
const logEl = document.getElementById('log');
const heroStatus = document.getElementById('hero-status');
const battleBtn = document.getElementById('battle');
const powerBtn = document.getElementById('upgrade-power');
const speedBtn = document.getElementById('upgrade-speed');

let level = 1;
let xp = 0;
let xpCap = 10;
let gold = 0;
let power = 1;
let intervalMs = 2000;
let idleInterval;

function log(message) {
  const line = document.createElement('div');
  line.textContent = message;
  logEl.prepend(line);
}

function update() {
  levelEl.textContent = level;
  xpEl.textContent = xp;
  xpCapEl.textContent = xpCap;
  goldEl.textContent = gold;
}

function gainXP(amount) {
  xp += amount;
  if (xp >= xpCap) {
    xp -= xpCap;
    level += 1;
    xpCap = Math.floor(xpCap * 1.4 + 5);
    log(`Level up! Reached level ${level}.`);
  }
  update();
}

function fight() {
  const rewardGold = Math.floor(Math.random() * 4 + 2) + power;
  const rewardXp = Math.floor(2 + power / 2);
  gold += rewardGold;
  gainXP(rewardXp);
  heroStatus.textContent = `Defeated foe for ${rewardGold}g and ${rewardXp} XP.`;
  save();
}

function startIdle() {
  clearInterval(idleInterval);
  idleInterval = setInterval(() => {
    heroStatus.textContent = 'Auto battling...';
    fight();
  }, intervalMs);
}

function upgradePower() {
  if (gold < 15) return;
  gold -= 15;
  power += 1;
  log(`Power increased to ${power}.`);
  update();
  save();
}

function upgradeSpeed() {
  if (gold < 20 || intervalMs <= 800) return;
  gold -= 20;
  intervalMs = Math.max(800, intervalMs - 200);
  startIdle();
  log(`Attack speed boosted! Interval: ${intervalMs}ms`);
  update();
  save();
}

function save() {
  const data = { level, xp, xpCap, gold, power, intervalMs };
  localStorage.setItem('rpgIdleSave', JSON.stringify(data));
}

function load() {
  const data = JSON.parse(localStorage.getItem('rpgIdleSave') || '{}');
  if (!Object.keys(data).length) return;
  level = data.level || level;
  xp = data.xp || xp;
  xpCap = data.xpCap || xpCap;
  gold = data.gold || gold;
  power = data.power || power;
  intervalMs = data.intervalMs || intervalMs;
}

battleBtn.addEventListener('click', fight);
powerBtn.addEventListener('click', upgradePower);
speedBtn.addEventListener('click', upgradeSpeed);

load();
update();
startIdle();
