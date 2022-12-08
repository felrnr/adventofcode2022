var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

const grid = data.split('\n').map(l => l.trim().split("").map(v => parseInt(v)));
const m = grid.length;
const n = grid[0].length;

function getVisibleTreeCount() {
  let visibleCount = 0;
  for (let r = 1; r < m-1; r++) {
    for (let c = 1; c < n-1; c++) {
      // N E S W
      const smallestBlockingTree = Math.min(
        Math.max(...grid.map(row => row[c]).slice(0,r)),
        Math.max(...grid[r].slice(c+1)),
        Math.max(...grid.map(row => row[c]).slice(r+1)),
        Math.max(...grid[r].slice(0,c))
      );
      if (grid[r][c] > smallestBlockingTree) visibleCount += 1;
    }
  }
  return visibleCount;
}
const innerTreeCount = getVisibleTreeCount();
const outerTreeCount = 2*(m-1) + 2*(n-1);

console.log(`Visible trees = ${innerTreeCount+outerTreeCount}`);

// Part 2
function computeViewDistance(trees, originSize) {
  let distance = 0;
  for (let i = 0; i < trees.length; i++) {
    distance += 1;
    if (trees[i] >= originSize) break;
  }
  return distance;
}

function getScenicScore(row,col) {
  const originTreeSize = grid[row][col];
  // N E S W
  return (
    computeViewDistance(grid.map(row => row[col]).slice(0,row).reverse(), originTreeSize) *
    computeViewDistance(grid[row].slice(col+1), originTreeSize) *
    computeViewDistance(grid.map(row => row[col]).slice(row+1), originTreeSize) *
    computeViewDistance(grid[row].slice(0,col).reverse(), originTreeSize)
  );
}

let maxScenicScore = 0;
for (let r = 1; r < m-1; r++) {
  for (let c = 1; c < n-1; c++) {
      maxScenicScore = Math.max(maxScenicScore, getScenicScore(r,c));
  }
}

console.log(`Maximum scenic score = ${maxScenicScore}`);
