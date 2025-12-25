const enemyName = document.getElementById('enemyName');
const hpText = document.getElementById('hp');
const hpFill = document.getElementById('hpFill');
const stageEl = document.getElementById('stage');
const goldEl = document.getElementById('gold');
const attackBtn = document.getElementById('attack');
const damageInfo = document.getElementById('damageInfo');
const autoInfo = document.getElementById('autoInfo');
const buyDamage = document.getElementById('buyDamage');
const buyAuto = document.getElementById('buyAuto');

let stage = 1;
let gold = 0;
let enemyHp = 50;
let currentHp = enemyHp;
let damage = 1;
let dps = 0;
let autoTimer;

function updateUI() {
  hpText.textContent = `HP: ${Math.max(0, Math.floor(currentHp))}`;
  hpFill.style.width = `${(currentHp / enemyHp) * 100}%`;
  stageEl.textContent = `Stage ${stage}`;
  goldEl.textContent = `Gold: ${gold}`;
  damageInfo.textContent = `Damage: ${damage}`;
  autoInfo.textContent = `DPS: ${dps}`;
}

function attack(amount) {
  currentHp -= amount;
  if (currentHp <= 0) {
    gold += Math.floor(10 + stage * 2);
    nextStage();
  }
  updateUI();
}

function nextStage() {
  stage++;
  enemyHp = Math.floor(40 + stage * 12);
  currentHp = enemyHp;
  enemyName.textContent = stage % 5 === 0 ? 'Elite Titan' : 'Arena Foe';
  updateUI();
}

attackBtn.addEventListener('click', () => attack(damage));

buyDamage.addEventListener('click', () => {
  const cost = 10 + damage * 5;
  if (gold >= cost) {
    gold -= cost;
    damage += 1;
    updateUI();
  }
});

buyAuto.addEventListener('click', () => {
  const cost = 20 + dps * 8;
  if (gold >= cost) {
    gold -= cost;
    dps += 1;
    updateUI();
  }
});

function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => {
    if (dps > 0) attack(dps * 0.5);
  }, 500);
}

updateUI();
startAuto();
