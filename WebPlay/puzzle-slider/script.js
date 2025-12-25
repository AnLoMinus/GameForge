const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const shuffleBtn = document.getElementById('shuffle');

let tiles = [];
let moves = 0;

function createTiles() {
  board.innerHTML = '';
  tiles = [...Array(15).keys()].map(n => n + 1);
  tiles.push(null); // empty
}

function isSolvable(arr) {
  const flat = arr.filter(Boolean);
  let inversions = 0;
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }
  const emptyRow = Math.floor(arr.indexOf(null) / 4);
  const blankFromBottom = 3 - emptyRow;
  return (blankFromBottom % 2 === 0) !== (inversions % 2 === 0);
}

function shuffle() {
  let attempt;
  do {
    attempt = [...Array(16).keys()]
      .map(n => (n === 15 ? null : n + 1))
      .sort(() => Math.random() - 0.5);
  } while (!isSolvable(attempt));
  tiles = attempt;
  moves = 0;
  render();
}

function render() {
  board.innerHTML = '';
  movesEl.textContent = moves;
  tiles.forEach((value, index) => {
    const tile = document.createElement('div');
    tile.className = 'tile' + (value ? '' : ' empty');
    tile.textContent = value || '';
    tile.dataset.index = index;
    if (value) tile.onclick = () => moveTile(index);
    board.appendChild(tile);
  });
}

function moveTile(index) {
  const emptyIndex = tiles.indexOf(null);
  const allowed = [emptyIndex - 1, emptyIndex + 1, emptyIndex - 4, emptyIndex + 4];
  if (!allowed.includes(index)) return;
  // prevent wrap left/right
  if (emptyIndex % 4 === 0 && index === emptyIndex - 1) return;
  if (index % 4 === 0 && emptyIndex === index - 1) return;

  [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
  moves += 1;
  render();
  if (isWin()) board.classList.add('win');
}

function isWin() {
  for (let i = 0; i < 15; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return true;
}

shuffleBtn.addEventListener('click', shuffle);
document.addEventListener('keydown', (e) => {
  const empty = tiles.indexOf(null);
  let target = null;
  if (e.key === 'ArrowUp') target = empty + 4;
  if (e.key === 'ArrowDown') target = empty - 4;
  if (e.key === 'ArrowLeft') target = empty + 1;
  if (e.key === 'ArrowRight') target = empty - 1;
  if (target !== null && tiles[target] !== undefined) moveTile(target);
});

createTiles();
shuffle();
