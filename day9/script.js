var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

const instructions = data.split('\n').map(l => l.trim().split(" ")).map(([d, l]) => ([d, parseInt(l)]));

function drawKnots(knots) {
  const dimensions=[26,21];
  const origin=[12,5];

  let board = [...Array(dimensions[1]).keys()].map(() => ".".repeat(dimensions[0]).split(""));
  board[origin[1]][origin[0]] = "s";
  knots.map(([x,y], i) => ([[x+origin[0],y+origin[1]], i==0 ? "H" : i.toString()]))
    .reverse()
    .forEach(([[x,y],label]) => board[y][x] = label)
  
  console.log("\n");
  for (let r = dimensions[1]-1; r >= 0; r--) {
    const pad = (r>9) ? "" : "0";
    console.log(`${pad}${r} ` + board[r].join(""));
  }
}

function simulate(knotCount, showKnots=false) {
  let knots = [...Array(knotCount).keys()].map(() => ([0,0]));
  let tailPositions = new Set();
  instructions.forEach(([direction, steps]) => {
    for (let s = 0; s < steps; s++) {
      if (direction === "R") knots[0][0]++;
      if (direction === "L") knots[0][0]--;
      if (direction === "U") knots[0][1]++;
      if (direction === "D") knots[0][1]--;
  
      for (let i = 1; i < knots.length; i++) {
        const [dx,dy] = [0,1].map(p => knots[i][p]-knots[i-1][p]); 
        if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
          knots[i] = [knots[i-1][0] + dx/2, knots[i-1][1] + dy/2]
        } else if (Math.abs(dx) === 2) {
          knots[i] = [knots[i-1][0] + dx/2, knots[i-1][1]];
        } else if (Math.abs(dy) === 2) {
          knots[i] = [knots[i-1][0], knots[i-1][1] + dy/2];
        }
      }
      tailPositions.add(`${knots.at(-1)[0]},${knots.at(-1)[1]}`);
    }
    if (showKnots) drawKnots(knots);
  })
  
  console.log(`Number of tailpositions: ${tailPositions.size}`);
}

// Part 1
simulate(2);

// Part 2
simulate(10);
