var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

const allCoordinates = data.split("\n")
  .map(l => /^.+x=(-?\d+), y=(-?\d+).+x=(-?\d+), y=(-?\d+)/.exec(l))
  .map(([,...matches]) => matches.map(n => parseInt(n)));

const sensors = allCoordinates.map(([x,y,bx,by]) => ({x,y, radius: Math.abs(bx-x) + Math.abs(by-y)}));

// Part 1
function part1(depth) {
  const sensorCoverages = sensors
    .filter(sensor => Math.abs(sensor.y-depth) <= sensor.radius)
    .map(({x,y,radius}) => ({x, width: radius - Math.abs(y-depth)}))
    .map(({x,width}) => [x-width,x+width]);
  sensorCoverages.sort((a,b) => a[0]-b[0]);

  // Coalesce ranges
  let [curStart, curEnd] = sensorCoverages[0];
  let ranges = [];
  sensorCoverages.forEach(([start,end]) => {
    if (curEnd < start) {
      ranges.push([curStart,curEnd]);
      curStart = start;
    }
    curEnd = Math.max(curEnd,end);
  });
  ranges.push([curStart,curEnd]);

  const positionsCovered = ranges.reduce((sum, [start,end]) => sum + (end-start) + 1,0);
  const beaconsAtDepth = new Set(allCoordinates.filter(coords => coords[3] === depth).map(([,,x,y])=>`${x},${y}`));
  
  console.log(`Total positions covered by beacons at depth ${depth} = ${positionsCovered - beaconsAtDepth.size}`);;
}
part1(10);

// Part2
function clamp(v,min,max) {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

function part2(size) {
  for (let depth = 0; depth <= size; depth++) {
    const sensorCoverages = sensors
      .filter(sensor => Math.abs(sensor.y-depth) <= sensor.radius) // can reach depth?
      .map(({x,y,radius}) => ({x, width: radius - Math.abs(y-depth)}))
      .map(({x,width}) => [clamp(x-width, 0, size),clamp(x+width,0,size)])
      .filter(([start,end]) => (start <= end));
    sensorCoverages.sort((a,b) => a[0]-b[0]);
  
    // Find position
    let curEnd = -1;
    for (let i = 0; i < sensorCoverages.length; i++) {
      const [start,end] = sensorCoverages[i];
      if (curEnd+1 < start) return [curEnd+1, depth];
      curEnd = Math.max(curEnd, end);
    }
    if (curEnd < size) return [size,depth]; 
  } 
}

const [x,y] = part2(4e6);
const tuningFrequency = x * 4e6 + y;
console.log(`Position found at: (${x},${y}) with tuning frequency: ${tuningFrequency}`)

