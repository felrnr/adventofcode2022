var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

function getInitialElfPositions() {
  let elfPositions = [];
  const lines = data.split("\n")
  lines.map((l,y) => l.split("").forEach((c,x) => {
    if (c === "#") elfPositions.push([x,lines.length-y-1]);
  }));
  return elfPositions;
}

// Part 1
function proposePositions(elfPositions, directions, iteration) {
  const positionMap = new Set(elfPositions.map(([x,y]) => `${x},${y}`));

  function hasBlockingNeighbours(x, y, direction=null) {
    if (direction === null) {
      return [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
        .some(([dx,dy]) => positionMap.has(`${x+dx},${y+dy}`));
    } else if (direction === "N" || direction === "S") {
      const dy = direction === "N" ? 1 : -1;
      return [-1,0,1].some((dx) => positionMap.has(`${x+dx},${y+dy}`));
    } else {
      const dx = direction === "E" ? 1 : -1;
      return [-1,0,1].some((dy) => positionMap.has(`${x+dx},${y+dy}`));
    }
  }

  const proposedPositions = elfPositions.map(([x,y]) => {
    if (hasBlockingNeighbours(x,y) === false) return [x, y];

    for (let i = 0; i < directions.length; i++) {
      const direction = directions[(iteration+i) % directions.length];
      if (hasBlockingNeighbours(x, y, direction)) continue;
      
      // This is where the elf decides to go.
      if (direction === "N") return [x, y+1];
      if (direction === "S") return [x, y-1];
      if (direction === "E") return [x+1, y];
      if (direction === "W") return [x-1, y];
    }
    // No valid place found after evaluating all directions. Stay put.
    return [x, y];
  });

  return proposedPositions;
}

function moveElves(elfPositions, proposedPositions) {
  let proposedMap = {};
  proposedPositions.map(([x,y]) => `${x},${y}`).forEach((c) => proposedMap[c] = (proposedMap[c] ?? 0) + 1);
  
  let anyMovement = false;
  proposedPositions.forEach(([x,y], idx) => {
    if (proposedMap[`${x},${y}`] > 1) return;
    if (elfPositions[idx][0] === x && elfPositions[idx][1] === y) return; // Same position
    elfPositions[idx] = [x,y];
    anyMovement = true;
  });

  return anyMovement;
}

function getDimensions(elfPositions) {
  let xMin, xMax, yMin, yMax;
  elfPositions.forEach(([x,y]) => {
    if (xMin === undefined || x < xMin) xMin = x;
    if (xMax === undefined || x > xMax) xMax = x;
    if (yMin === undefined || y < yMin) yMin = y;
    if (yMax === undefined || y > yMax) yMax = y;
  });

  return { xMin, xMax, yMin, yMax,
    width: 1 + xMax - xMin,
    height: 1 + yMax - yMin,
  }; 
}

function drawPositions(elfPositions) {
  const {width, height, xMin, yMin} = getDimensions(elfPositions);
  let board = new Array(height).fill().map(() => new Array(width).fill("."));
  elfPositions.forEach(([x,y]) => board[y-yMin][x-xMin] = "#");
  console.log("Board:")
  for (let y = board.length-1; y >= 0; y--) {
    console.log(y.toString().padStart(2) + " " + board[y].join(""));
  }
}

function countEmptyTiles(elfPositions) {
  const {width, height} = getDimensions(elfPositions);
  return (width*height) - elfPositions.length;
}

function simulate(maxIterations) {
  const directions = ["N", "S", "W", "E"];
  let elfPositions = getInitialElfPositions();
  drawPositions(elfPositions);
  
  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    const proposedPositions = proposePositions(elfPositions, directions, iteration-1);
    const anyElfMoved = moveElves(elfPositions, proposedPositions);
    
    if (iteration === 10) {
      console.log(`\nPart 1: Iteration ${iteration} / ${maxIterations}`);
      console.log("Empty tiles: " + countEmptyTiles(elfPositions));
    }

    if (anyElfMoved === false) {
      console.log(`\nPart 2: Iteration ${iteration} / ${maxIterations}`);
      break;
    }
  }
}

simulate(1000);
