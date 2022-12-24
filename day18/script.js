var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

const coordinates = data.split("\n").map(l => l.trim().split(",").map(c => parseInt(c)));

let xmax = 0, ymax = 0, zmax = 0;
coordinates.forEach(([x,y,z]) => {
  if (x > xmax) xmax = x;
  if (y > ymax) ymax = y;
  if (z > zmax) zmax = z;
});

const AIR = 0, LAVA = 1, FRESH_AIR = 2;
let grid = new Array(xmax+2).fill().map(() => new Array(ymax+2).fill().map(() => new Array(zmax+2).fill(AIR)));
coordinates.forEach(([x,y,z]) => grid[x][y][z] = LAVA);

const neighbours = [[-1,0,0], [1,0,0], [0,-1,0], [0,1,0], [0,0,-1], [0,0,1]];

// Part 1
let sumFaces = coordinates.reduce((total, [x,y,z]) => 
  total + neighbours.filter(([dx,dy,dz]) => x+dx < 0 || y+dy < 0 || z+dz < 0 || grid[x+dx][y+dy][z+dz] === AIR).length
,0);
console.log(`number of visible faces: ${sumFaces}`);


// Part 2
function floodfill() {
  let Q = [[0,0,0]]; // Start anywhere with fresh air
  while (Q.length > 0) {
    let [x,y,z] = Q.shift();

    neighbours.forEach(([dx,dy,dz]) => {
      if (x+dx < 0 || x+dx > xmax+1 || y+dy < 0 || y+dy > ymax+1 || z+dz < 0 || z+dz > zmax+1) return;
      if (grid[x+dx][y+dy][z+dz] === AIR)  {
        grid[x+dx][y+dy][z+dz] = FRESH_AIR;
        Q.push([x+dx, y+dy, z+dz]);
      }
    });
  }
}
floodfill();

sumFaces = coordinates.reduce((total, [x,y,z]) => 
  total + neighbours.filter(([dx,dy,dz]) => x+dx < 0 || y+dy < 0 || z+dz < 0 || grid[x+dx][y+dy][z+dz] === FRESH_AIR).length
,0);
console.log(`number of visible faces: ${sumFaces}`);
