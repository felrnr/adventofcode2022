var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

const grid = data.split("\n").map(l => l.split(""));
const [width, height] = [grid[0].length, grid.length];

const getNodeId = (x,y) => y*width + x;
const getXY = (node_id) => ([node_id%width, Math.floor(node_id/width)]);

let start, end;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x]==="S") {
      start = getNodeId(x,y);
      grid[y][x] = 0;
    } else if(grid[y][x] === "E") {
      end = getNodeId(x,y);
      grid[y][x] = 25;
    } else {
      grid[y][x] = grid[y][x].charCodeAt(0) - "a".charCodeAt(0);
    } 
  }
}

function getNeighbours(x,y) {
  return [[0,1], [0,-1], [-1,0], [1,0]]
    .map(([dx,dy]) => ([x+dx, y+dy]))
    .filter(([x,y]) => (x>=0 && x<width && y>=0 && y<height));
}

// Part 2 -- working backwards from goal is easier :)
function bfs(start, goal, target_height) {
  let queue = [goal];
  let parents = [];
  let v;
  while (queue.length > 0) {
    v = queue.shift();
    const [x,y] = getXY(v);
    const node_height = grid[y][x];
    
    if (parents.includes(v)) continue;
    if (v === start || node_height === target_height) break;

    getNeighbours(x,y).forEach(([nx,ny]) => {
      const id = getNodeId(nx,ny);
      if (parents[id] !== undefined || grid[ny][nx] < node_height-1) return;
      parents[id] = v;
      queue.push(id);
    });
  }

  let cur_node = v;
  let distance = 0;
  while (cur_node !== goal) {
    cur_node = parents[cur_node];
    distance++;
  }

  console.log(`Distance: ${distance}`);
}

// Part 1
bfs(start, end, null);

// Part 2
bfs(null, end, 0);
