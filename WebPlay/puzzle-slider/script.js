const boardEl = document.getElementById('board');
const movesEl = document.getElementById('moves');
const statusEl = document.getElementById('status');
const shuffleBtn = document.getElementById('shuffle');

let tiles = [];
let moves = 0;

function createBoard() {
  boardEl.innerHTML = '';
  tiles.forEach((num, idx) => {
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.textContent = num === 0 ? '' : num;
    if (num === 0) tile.classList.add('empty');
    tile.addEventListener('click', () => moveTile(idx));
    boardEl.appendChild(tile);
  });
}

function moveTile(idx) {
  const emptyIdx = tiles.indexOf(0);
  const allowed = [idx-1, idx+1, idx-4, idx+4];
  if (!allowed.includes(emptyIdx)) return;
  // guard row edges
  if (idx % 4 === 0 && emptyIdx === idx-1) return;
  if (idx % 4 === 3 && emptyIdx === idx+1) return;

  [tiles[idx], tiles[emptyIdx]] = [tiles[emptyIdx], tiles[idx]];
  moves++;
  movesEl.textContent = moves;
  createBoard();
  checkWin();
}

function shuffle() {
  tiles = [...Array(15).keys()].map(n => n+1).concat([0]);
  do {
    tiles = tiles.sort(() => Math.random() - 0.5);
  } while (!isSolvable(tiles));
  moves = 0;
  movesEl.textContent = moves;
  statusEl.textContent = '';
  createBoard();
}

function isSolvable(arr) {
  let inversions = 0;
  for (let i=0;i<arr.length;i++) {
    for (let j=i+1;j<arr.length;j++) {
      if (arr[i] && arr[j] && arr[i] > arr[j]) inversions++;
    }
  }
  const rowFromBottom = 4 - Math.floor(arr.indexOf(0) / 4);
  return (rowFromBottom % 2 === 0) !== (inversions % 2 === 0);
}

function checkWin() {
  const isWin = tiles.slice(0,15).every((n, i) => n === i+1);
  if (isWin) {
    statusEl.textContent = 'ניצחון! פתרתם את הפאזל';
    document.querySelectorAll('.tile').forEach(t => t.disabled = true);
  }
}

shuffleBtn.addEventListener('click', shuffle);
shuffle();
