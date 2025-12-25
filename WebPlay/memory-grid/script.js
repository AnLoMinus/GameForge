const icons = ['🍀','🚀','🎮','🧠','🧩','🪐','⚡','🌟'];
const gridEl = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('reset');

let flipped = [];
let matched = 0;
let moves = 0;
let timer = 60;
let countdown;

function shuffle(arr) {
  for (let i = arr.length -1; i>0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startTimer() {
  clearInterval(countdown);
  timer = 60;
  timeEl.textContent = timer;
  countdown = setInterval(() => {
    timer--;
    timeEl.textContent = timer;
    if (timer <= 0) {
      endGame(false);
    }
  }, 1000);
}

function setup() {
  gridEl.innerHTML = '';
  messageEl.textContent = '';
  matched = 0;
  moves = 0;
  flipped = [];
  movesEl.textContent = moves;

  const deck = shuffle([...icons, ...icons]);
  deck.forEach((icon, idx) => {
    const card = document.createElement('button');
    card.className = 'card';
    card.dataset.value = icon;
    card.innerHTML = `<span>${icon}</span>`;
    card.addEventListener('click', () => flipCard(card));
    gridEl.appendChild(card);
  });
  startTimer();
}

function flipCard(card) {
  if (card.classList.contains('flipped') || card.classList.contains('matched') || flipped.length === 2) return;
  card.classList.add('flipped');
  flipped.push(card);
  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    const [a,b] = flipped;
    if (a.dataset.value === b.dataset.value) {
      a.classList.add('matched');
      b.classList.add('matched');
      flipped = [];
      matched += 2;
      messageEl.textContent = 'יפה! נמצא זוג';
      if (matched === 16) endGame(true);
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        flipped = [];
      }, 800);
    }
  }
}

function endGame(win) {
  clearInterval(countdown);
  messageEl.textContent = win ? 'ניצחתם! כל הכבוד 🎉' : 'הזמן נגמר! נסו שוב';
  document.querySelectorAll('.card').forEach(card => card.disabled = true);
}

resetBtn.addEventListener('click', setup);
setup();
