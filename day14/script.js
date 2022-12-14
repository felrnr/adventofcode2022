var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

const rockPaths = data.split('\n').map(l => l.split(' -> ').map(coord => coord.split(',').map(c => parseInt(c))));
const sandOrigin = [500, 0];

const AIR = ".";
const ROCK = "#";
const SAND = "o";
const SPAWN = "+";

let bounds = {
  x: [sandOrigin[0], sandOrigin[0]],
  y: [sandOrigin[1], sandOrigin[1]],
};

rockPaths.forEach(path => path.forEach(([x,y]) => {
  if (bounds.x[0] === null || x < bounds.x[0]) bounds.x[0] = x;
  if (bounds.x[1] === null || x > bounds.x[1]) bounds.x[1] = x;
  if (bounds.y[0] === null || y < bounds.y[0]) bounds.y[0] = y;
  if (bounds.y[1] === null || y > bounds.y[1]) bounds.y[1] = y;
}));

let caveOrigin = {x: bounds.x[0], y: bounds.y[0]};
let caveDim = { width: 1 + bounds.x[1]-bounds.x[0], height: 1 + bounds.y[1]-bounds.y[0] };
let cave = new Array(caveDim.height).fill().map(() => new Array(caveDim.width).fill(AIR));

// Draw paths
function setTile(x,y,type) {
  cave[y-caveOrigin.y][x-caveOrigin.x] = type;
}
const getTile = (x,y) => cave[y-caveOrigin.y][x-caveOrigin.x];

setTile(...sandOrigin, SPAWN);
rockPaths.forEach(([head, ...tail]) => {
  let [x,y] = head;
  setTile(x,y,ROCK);

  tail.forEach(([tx,ty]) => {
    while (x !== tx || y !== ty) {
      if (x < tx) x++;
      if (x > tx) x--;
      if (y < ty) y++;
      if (y > ty) y--;
      setTile(x,y,ROCK);
    }
  });
});

function draw() {
  cave.forEach((r,i) => console.log(i,r.join("")) )
}
draw();

function checkBounds(x,y) {
  return (x >= bounds.x[0] && x <= bounds.x[1] && y >= bounds.y[0] && y <= bounds.y[1]);
}

function spawnSand(maxIterations=20) {
  let sandsPlaced = 0;
  while (sandsPlaced < maxIterations) {
    let [x,y] = sandOrigin;
    let status = 0;
    while (status === 0) {
      let dx = [0,-1,1].find(dx => !checkBounds(x+dx,y+1) || [AIR, SPAWN].includes(getTile(x+dx,y+1)));
      if (dx === undefined) {
        setTile(x,y,SAND);
        status = 1;
      } else if (checkBounds(x+dx,y+1) === false) {
        status = -1;
      } else {
        y++;
        x+=dx;
      }
    }
    if (status < 0) {
      break; // out of bounds, no sand can be placed.
    } else if (status > 0) {
      sandsPlaced++;
    }
  }
  console.log(`Simulation finished after placing ${sandsPlaced} grains of sand.`);
}
spawnSand(3000);
draw();


// part 2
// Max width following diagional sand falling down: [spawn-height, spawn+heigth]
bounds.y[1]+=2; // Add extra AIR + ROCK layers
caveDim.height = 1 + bounds.y[1]-bounds.y[0];

bounds.x = [Math.min(bounds.x[0], sandOrigin[0]-caveDim.height), Math.max(bounds.x[1], sandOrigin[0]+caveDim.height)];
caveDim.width = 1 + bounds.x[1]-bounds.x[0];

caveOrigin = {x: bounds.x[0], y: bounds.y[0]};
cave = new Array(caveDim.height).fill().map(() => new Array(caveDim.width).fill(AIR));
cave.at(-1).fill(ROCK);

setTile(...sandOrigin, SPAWN);
rockPaths.forEach(([head, ...tail]) => {
  let [x,y] = head;
  setTile(x,y,ROCK);

  tail.forEach(([tx,ty]) => {
    while (x !== tx || y !== ty) {
      if (x < tx) x++;
      if (x > tx) x--;
      if (y < ty) y++;
      if (y > ty) y--;
      setTile(x,y,ROCK);
    }
  });
});

draw();
function spawnSand2(maxIterations=20) {
  const validTileTypes = [AIR, SPAWN];
  let sandsPlaced = 0;
  while (sandsPlaced < maxIterations) {
    let [x,y] = sandOrigin;
    let status = 0;
    while (status === 0) {
      
      let dx = [0,-1,1].find(dx => !checkBounds(x+dx,y+1) || [AIR, SPAWN].includes(getTile(x+dx,y+1)));
      if (dx === undefined) {
        // New end state -- reached spawnpoint
        if (x===sandOrigin[0] && y === sandOrigin[1]) {
          status = -1;
        } else {
          setTile(x,y,SAND);
          status = 1;
        }
      } else if (checkBounds(x+dx,y+1) === false) {
        status = -1;
      } else {
        y++;
        x+=dx;
      }
    }
    if (status < 0) {
      break; // out of bounds, no sand can be placed.
    } else if (status > 0) {
      sandsPlaced++;
    }
  }
  console.log(`Simulation finished after placing ${sandsPlaced+1} grains of sand.`);
}
spawnSand2(30000);
draw();
