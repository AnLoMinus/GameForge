const grid = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const matchesEl = document.getElementById('matches');
const resetBtn = document.getElementById('reset');
const modal = document.getElementById('modal');
const summary = document.getElementById('summary');
const playAgain = document.getElementById('playAgain');

const icons = ['🌟','🐱','🚀','🌿','🎲','⚡','🧩','🎯'];
let deck = [];
let first = null;
let lock = false;
let moves = 0;
let matches = 0;
let timer;
let seconds = 0;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startTimer() {
  clearInterval(timer);
  seconds = 0;
  timer = setInterval(() => {
    seconds++;
    timeEl.textContent = `Time: ${seconds}s`;
  }, 1000);
}

function reset() {
  deck = shuffle([...icons, ...icons]);
  grid.innerHTML = '';
  moves = 0;
  matches = 0;
  movesEl.textContent = 'Moves: 0';
  matchesEl.textContent = 'Matches: 0/8';
  modal.classList.add('hidden');
  first = null;
  lock = false;
  startTimer();
  deck.forEach((icon, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.icon = icon;
    card.dataset.index = idx;

    const front = document.createElement('div');
    front.className = 'face front';
    front.textContent = '?';
    const back = document.createElement('div');
    back.className = 'face back';
    back.textContent = icon;

    card.append(front, back);
    card.addEventListener('click', () => flip(card));
    grid.appendChild(card);
  });
}

function flip(card) {
  if (lock || card.classList.contains('matched') || card === first) return;
  card.classList.add('flipped');
  if (!first) {
    first = card;
    return;
  }
  lock = true;
  moves++;
  movesEl.textContent = `Moves: ${moves}`;
  if (card.dataset.icon === first.dataset.icon) {
    card.classList.add('matched');
    first.classList.add('matched');
    matches++;
    matchesEl.textContent = `Matches: ${matches}/8`;
    lock = false;
    first = null;
    if (matches === 8) endGame();
  } else {
    setTimeout(() => {
      card.classList.remove('flipped');
      first.classList.remove('flipped');
      lock = false;
      first = null;
    }, 800);
  }
}

function endGame() {
  clearInterval(timer);
  summary.textContent = `You finished in ${seconds}s with ${moves} moves.`;
  modal.classList.remove('hidden');
}

resetBtn.addEventListener('click', reset);
playAgain.addEventListener('click', reset);
window.addEventListener('load', reset);
