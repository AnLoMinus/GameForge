const attackBtn = document.getElementById('attack');
const upgradeBtn = document.getElementById('upgrade');
const healthFill = document.getElementById('health-fill');
const bossName = document.getElementById('boss-name');
const stageEl = document.getElementById('stage');
const powerEl = document.getElementById('power');
const goldEl = document.getElementById('gold');

let stage = 1;
let power = 1;
let gold = 0;
let maxHp = 50;
let hp = maxHp;

function updateUI() {
  healthFill.style.width = `${(hp / maxHp) * 100}%`;
  stageEl.textContent = stage;
  powerEl.textContent = power;
  goldEl.textContent = gold;
  bossName.textContent = `Stage ${stage} Beast`;
}

function attack() {
  hp -= power;
  if (hp <= 0) {
    gold += Math.floor(stage * 5);
    stage += 1;
    maxHp = Math.floor(maxHp * 1.25 + 10);
    hp = maxHp;
  }
  updateUI();
}

function upgrade() {
  if (gold < 10) return;
  gold -= 10;
  power += 1;
  updateUI();
}

attackBtn.addEventListener('click', attack);
upgradeBtn.addEventListener('click', upgrade);
updateUI();
