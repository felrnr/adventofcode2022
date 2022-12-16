var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

let valves = data.split("\n")
  .map(l => /^Valve ([A-Z]{2}) has flow rate=(\d+);.+valves? (.+)/.exec(l))
  // .map(([,valve,rate, connections]) => ({valve, rate, connections: connections.split(", ")}));
  .reduce((dict, [,id,rate,links]) => ({
    [id]: {
      rate: parseInt(rate), 
      connections: Object.fromEntries(links.split(", ").map(c => ([c,1])))
    },
    ...dict}), {})

const startId = "AA";

// Remove empty links
Object.keys(valves).filter(delId => valves[delId].rate === 0).forEach((delId) => {
  Object.keys(valves).filter(id => valves[id].connections[delId] !== undefined).forEach(id => {
    // Update with routes 
    const neighbours = valves[id].connections;
    const distanceToDeletedValve = neighbours[delId];
    Object.entries(valves[delId].connections).filter(([toId])=>toId!==id).forEach(([toId, dist]) => {
      if (neighbours[toId] === undefined) {
        neighbours[toId] = dist+distanceToDeletedValve;
      } else if (neighbours[toId] > dist+distanceToDeletedValve) {
        neighbours[toId] = dist+distanceToDeletedValve;
      };
    }); 
    delete neighbours[delId];
  });
  if (delId !== startId) delete valves[delId]; // Keep startId for simplicity, not used after we leave it.
});


// Part 1
// map id to int for desperate attempt at gaining performance...
const idMapping = Object.fromEntries(Object.keys(valves).map((k,i) => [k, 2**i]));
valves = Object.fromEntries(
  Object.entries(valves)
    .map(([k, {rate, connections}]) => [
    idMapping[k], 
    {
      rate, 
      connections: Object.fromEntries(Object.entries(connections).map(([k,v])=>[idMapping[k],v])),
    }
  ])
);

function visit(trace, openValves, timeLeft, flowRate, curValveId) {
  if (timeLeft <= 1) return flowRate*timeLeft;
  
  let maxRelease = flowRate;

  // Check self if not opened.
  if ((openValves & curValveId) === 0) {
    let extraFlow = valves[curValveId].rate;
    let release = visit(curValveId, openValves|curValveId, timeLeft-1, flowRate+extraFlow, curValveId);
    // let release = visit([curValveId], [curValveId, ...openValves], timeLeft-1, flowRate+extraFlow, curValveId);
    if (release + flowRate > maxRelease) maxRelease = release + flowRate;
  }
  
  // Check connections
  Object.entries(valves[curValveId].connections).map(([toId, dist]) => [parseInt(toId), dist])
    .filter(([toId, dist]) =>  ((trace&toId) === 0 && timeLeft > dist)) // Not visited and time to reach
    .forEach(([toId, dist]) => {
      let release = visit(trace|curValveId, openValves, timeLeft-dist, flowRate, toId);
      // let release = visit([...trace, curValveId], [...openValves], timeLeft-dist, flowRate, toId);
      if (release + dist*flowRate > maxRelease) maxRelease = release + dist*flowRate 
    });

    return maxRelease;
}

console.log((new Date()));
let pressureReleasedfast = visit(idMapping[startId],0,30,0,idMapping[startId]);
console.log(`total pressure released: ${pressureReleasedfast}`);
console.log((new Date()));