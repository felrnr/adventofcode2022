var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

let valves = data.split("\n")
  .map(l => /^Valve ([A-Z]{2}) has flow rate=(\d+);.+valves? (.+)/.exec(l))
  .reduce((dict, [,id,rate,links]) => ({
    [id]: {
      id,
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


function setShortestPaths(node) {
  // Use variant of dijkstra's algorithm
  let dist = Object.fromEntries(Object.keys(valves).map(k => ([k, k===node ? 0 : (valves[node].connections[k] ?? 999)])));
  let Q = Object.entries(dist).filter(([,d]) => d > 0).map(([k]) => k);
  let prev = Object.fromEntries(Object.entries(dist).map(([k,v]) => [k, v===999 ? null : node]));
  
  while (Q.length > 0) {
      let u = Q.sort((a,b) => dist[a]-dist[b])[0];
      Q.shift();

      Q.filter(v => valves[u].connections[v] !== undefined).forEach(v => {
          let alt = dist[u] + valves[u].connections[v];
          if (alt < dist[v]) {
              dist[v] = alt
              prev[v] = u
          }
      })
  }
  delete dist[node];
  delete dist[startId];
  valves[node].connections = dist;
}

Object.keys(valves).forEach(setShortestPaths);

// Part 1
// Return the max flow pressure release by following this path

// map id to int for desperate attempt at gaining performance...
const idMapping = Object.fromEntries(Object.keys(valves).map((k,i) => [k, 2**i]));
valves = Object.fromEntries(
  Object.entries(valves)
    .map(([k, {id, rate, connections}]) => [
    idMapping[k], 
    {
      id,
      rate, 
      connections: Object.fromEntries(Object.entries(connections).map(([k,v])=>[idMapping[k],v])),
    }
  ])
);

let counter = 0;
function visit(openValves, timeLeft, flowRate, curValveId) {
  if (counter++%1000 === 0) console.log(`Counter: ${counter}`);

  // Default is do nothing and wait.
  let maxRelease = flowRate*timeLeft;
  let route = [];
  
  // Find best connection
  Object.entries(valves[curValveId].connections).map(([toId, dist]) => [parseInt(toId), dist])
    .filter(([toId, dist]) =>  ((openValves&toId)===0 && timeLeft > dist)) // Not visited and time to reach
    .forEach(([toId, dist]) => {
      let extraFlow = valves[toId].rate; // from opening new valves
      let [release, r] = visit(openValves|toId, timeLeft-(dist+1), flowRate+extraFlow, toId);
      let travelFlow = (dist+1)*flowRate; // accumulated during travel

      if (release + travelFlow > maxRelease) {
        maxRelease = release + travelFlow;
        route = r;
      }
    });

    return [maxRelease, [...route, curValveId]];
}

console.log((new Date()));
let [pressureReleasedfast, route] = visit(0,30,0,idMapping[startId]);
console.log(`total pressure released: ${pressureReleasedfast}`);
console.log(`final counter: ${counter}`);
console.log((new Date()));
route.forEach(id => console.log("Visited node: " + valves[id].id));
