const grid = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const shuffleBtn = document.getElementById('shuffle');
const banner = document.getElementById('win');

let tiles = Array.from({ length: 15 }, (_, i) => i + 1).concat('');
let moves = 0;

function render() {
  grid.innerHTML = '';
  tiles.forEach((val, idx) => {
    const tile = document.createElement('div');
    tile.className = 'tile' + (val === '' ? ' empty' : '');
    tile.textContent = val;
    tile.addEventListener('click', () => move(idx));
    grid.appendChild(tile);
  });
  movesEl.textContent = `Moves: ${moves}`;
  banner.classList.toggle('hidden', !isSolved());
}

function coords(index) { return { r: Math.floor(index / 4), c: index % 4 }; }

function move(index) {
  const empty = tiles.indexOf('');
  const { r, c } = coords(index);
  const e = coords(empty);
  const isNeighbor = (Math.abs(r - e.r) + Math.abs(c - e.c)) === 1;
  if (!isNeighbor || tiles[index] === '') return;
  [tiles[index], tiles[empty]] = [tiles[empty], tiles[index]];
  moves++;
  render();
}

function shuffle() {
  do {
    const pool = tiles.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    if (isSolvable(pool)) {
      tiles = pool;
      break;
    }
  } while (true);
  moves = 0;
  render();
}

function isSolvable(arr) {
  const nums = arr.filter(Boolean);
  let inversions = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) inversions++;
    }
  }
  const emptyRowFromBottom = 4 - Math.floor(arr.indexOf('') / 4);
  if (4 % 2 === 0) {
    return emptyRowFromBottom % 2 === 0 ? inversions % 2 === 1 : inversions % 2 === 0;
  }
  return inversions % 2 === 0;
}

function isSolved() {
  for (let i = 0; i < 15; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[15] === '';
}

shuffleBtn.addEventListener('click', shuffle);
window.addEventListener('load', shuffle);
