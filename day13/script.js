var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

const pairs = data.split("\n\n")
  .map(p => p.split("\n").map(l => JSON.parse(l)));

function cmp(a,b) {
  if (typeof a === "number" && typeof b === "number") return (a===b) ? 0 : a-b;

  let left = (typeof a === "number") ? [a] : a;
  let right = (typeof b === "number") ? [b] : b;

  for (let i = 0; i < left.length || 0; i++) {
    if (i >= right.length) return 1;
    const res = cmp(left[i], right[i]);
    if (res === 0) continue;
    return res;
  }
  
  return (left.length||0) - (right.length||0);
}

// Part 1
const part1 = pairs.reduce((sum, pair, i) => (sum + ((cmp(...pair) <= 0) ? i+1 : 0)), 0);
console.log(`Total: ${part1}`);

// Part 2
const packets = data.trim().split(/\n+/).map(l => JSON.parse(l));
[2,6].forEach((n) => packets.push([[n]]));

const distressSignal = packets.sort(cmp)
  .reduce((signal, packet, i) => (signal * (/^\[\[[2|6]\]\]$/.test(JSON.stringify(packet)) ? i+1 : 1)), 1);

console.log(`Part2 ${distressSignal}`);
