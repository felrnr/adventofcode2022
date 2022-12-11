var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
let data = fs.readFileSync(filepath).toString();
let input_data = data.trim().split("\n");

let pairs = input_data
  .map(l => l.trim().split(","))
  .map((e) => e.map(r => r.split("-").map(v => parseInt(v))));

// Part 1
let full_overlaps = pairs.filter(([[l1,u1],[l2,u2]]) => ((l1<=l2 && u2<=u1) || (l2<=l1 && u1<=u2)));
console.log(`Pairs with full overlaps: ${full_overlaps.length}`);

// Part 2
// Part 1
let partial_overlaps = pairs.filter(
  ([[l1, u1], [l2, u2]]) =>
    (l1 <= l2 && l2 <= u1) ||
    (l2 <= l1 && l1 <= u2) ||
    (l2 <= u1 && u1 <= u2) ||
    (l2 <= u1 && u1 <= u2)
);
console.log(`Pairs with full overlaps: ${partial_overlaps.length}`);
