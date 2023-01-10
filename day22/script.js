var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

const VOID = " ";
const FLOOR = ".";
const WALL = "#";
const directions = [[1,0], [0,1], [-1,0], [0,-1]]; // E S W N
const directionVisual = [">","v","<", "^"];
  
function parseInput() {
  let [boardData, instructionData] = data.split("\n\n");
  // Parse Board
  let lines = boardData.split("\n");
  const height = lines.length;
  const width = Math.max(...lines.map(l => l.length));
  let board = new Array(height).fill().map(() => new Array(width).fill(VOID));
  lines.forEach((l,y) => [...l].forEach((c,x) => board[y][x] = c));

  // Parse instructions
  let currentInstruction = "";
  let instructions = [];
  [...instructionData].forEach(c => {
    if (/\d/.test(c)) currentInstruction += c;
    else {
      instructions.push(parseInt(currentInstruction));
      instructions.push(c);
      currentInstruction = "";
    }
  });
  if (currentInstruction.length > 0) instructions.push(parseInt(currentInstruction));

  return { board, instructions };
}

// Compute a mod b also considering negative a.
function modulo(a,b) {
  return (a >= b) ? a % b : a + Math.ceil(-1*a / b)*b;
}

// Return new coordinates or null if there is no valid next position.
function findNextTile(board, direction, curx, cury) {
  const width = board[0].length, height = board.length; 
  const [dx,dy] = direction;
  let x = curx, y = cury;
  while (true) {
    x = modulo(x+dx, width), y = modulo(y+dy, height);
    if (x === curx && y === cury) return null;
    if (board[y][x] === WALL) return null;
    if (board[y][x] === FLOOR) return [x, y];
  }
}

function part1() {
  let iDirection = 0; // Starting direction facing East
  
  const { board, instructions } = parseInput();
  // StartingPosition
  let [x, y] = [board[0].findIndex(v => v === FLOOR), 0];

  instructions.forEach((v,i) => {
    console.log(`Processing step ${i+1}: instruction = ${v}. Current position: (${x},${y}) facing direction ${directionVisual[iDirection]}`);
    if (typeof v === "string") {
      if (v === "R") iDirection = modulo(iDirection+1, directions.length);
      if (v === "L") iDirection = modulo(iDirection-1, directions.length);
      return;
    }

    let stepsLeft = v;
    while (stepsLeft > 0) {
      let nextTile = findNextTile(board, directions[iDirection], x, y);
      if (nextTile === null) break;
      [x, y] = nextTile;
      stepsLeft--;
    }

    console.log(`Position after movement: (${x},${y}). StepsLeft: ${stepsLeft}`);
  });

  console.log(`Finished processing instructions. Final position: (${x},${y}). Direction: ${directionVisual[iDirection]}`);
  console.log(`Final score: 1000*${y+1} + 4*${x+1} + ${iDirection} = ${computeScore(y,x,iDirection)}`);
}

const computeScore = (row, col, direction) => (row+1)*1000 + (col+1)*4 + direction;

part1();
console.log();
