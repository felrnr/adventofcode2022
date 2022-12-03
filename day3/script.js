var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
let data = fs.readFileSync(filepath).toString();
let rucksacks = data.trim().split("\n").map(l => l.trim());

function findDuplicates(s1, s2) {
  return new Set([...s2].filter(v => s1.has(v)));
}

function getPriority(char) {
  if (char.toLowerCase() === char)
    return 1 + char.charCodeAt(0) - "a".charCodeAt(0);
  else 
    return 27 + char.charCodeAt(0) - "A".charCodeAt(0);
}
  
// Part 1
let score = rucksacks
  .map(items =>
    findDuplicates(
      new Set(items.slice(0, items.length / 2)),
      new Set(items.slice(items.length / 2))
    )
  )
  .map(([shared_item]) => getPriority(shared_item))
  .reduce((a, b) => a + b);

console.log("Score: " + score);

// Part 2
rucksacks = rucksacks.map(items => new Set(items));
const groups = [...Array(rucksacks.length/3).keys()];
score = groups
  .map(group => {
    let dups = findDuplicates(rucksacks[3*group], rucksacks[3*group + 1]);
    return findDuplicates(dups, rucksacks[3*group + 2]);
  })
  .map(([badge]) => getPriority(badge))
  .reduce((a ,b) => a + b);

console.log("Score: " + score);
