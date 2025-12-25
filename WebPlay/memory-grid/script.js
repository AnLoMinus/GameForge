const symbols = ['🍀','🚀','🎧','🌙','🔥','🌊','🎯','🧩'];
const grid = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const timerEl = document.getElementById('timer');
const resetBtn = document.getElementById('reset');

let flipped = [];
let lock = false;
let moves = 0;
let matches = 0;
let startTime = null;
let timerInterval;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const diff = Date.now() - startTime;
    const minutes = String(Math.floor(diff / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    timerEl.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function setup() {
  grid.innerHTML = '';
  const deck = shuffle([...symbols, ...symbols]);
  flipped = [];
  lock = false;
  moves = 0;
  matches = 0;
  movesEl.textContent = '0';
  matchesEl.textContent = '0';
  timerEl.textContent = '00:00';
  clearInterval(timerInterval);
  startTime = null;

  deck.forEach((symbol, idx) => {
    const card = document.createElement('button');
    card.className = 'card';
    card.setAttribute('aria-label', `Card ${idx + 1}`);
    card.innerHTML = `
      <div class="face front"></div>
      <div class="face back">${symbol}</div>
    `;
    card.onclick = () => flipCard(card, symbol);
    grid.appendChild(card);
  });
}

function flipCard(card, symbol) {
  if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  if (!startTime) startTimer();
  card.classList.add('flipped');
  flipped.push({ card, symbol });

  if (flipped.length === 2) {
    lock = true;
    moves += 1;
    movesEl.textContent = moves;
    const [first, second] = flipped;
    if (first.symbol === second.symbol) {
      first.card.classList.add('matched');
      second.card.classList.add('matched');
      matches += 1;
      matchesEl.textContent = matches;
      flipped = [];
      lock = false;
      if (matches === symbols.length) clearInterval(timerInterval);
    } else {
      setTimeout(() => {
        first.card.classList.remove('flipped');
        second.card.classList.remove('flipped');
        flipped = [];
        lock = false;
      }, 700);
    }
  }
}

resetBtn.addEventListener('click', setup);
setup();
