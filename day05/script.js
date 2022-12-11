var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
let data = fs.readFileSync(filepath).toString().trimEnd();
let [stackData, instructionsData] = data.split("\n\n").map(l => l.split('\n'));

let [stackLabels, ...stackContents] = stackData.reverse();
let initialStacks = stackLabels.trim().split(/\s+/).map(_ => ([]));
stackContents.forEach(s => {
  for (let i = 0; i < initialStacks.length; i++) {
    const char = s.charAt(1 + 4*i);
    if (char.trim().length > 0) initialStacks[i].push(char);
  } 
});

let instructions = instructionsData
  .map(l => l.split(" "))
  .map((a) => [a[1],a[3],a[5]].map(v => parseInt(v)));

// Part 1:  
let stacks = JSON.parse(JSON.stringify(initialStacks)); // deep copy input
instructions.forEach(([quantity, from, to]) => {
  for (let i = 0; i < quantity; i++) {
    stacks[to-1].push(stacks[from-1].pop());
  }
});

let topCrates = stacks.reduce((msg, stack) => msg + stack.at(-1), "");
console.log("Part 1 message: " + topCrates);


// Part 2:
stacks = JSON.parse(JSON.stringify(initialStacks)); //deep copy input
instructions.forEach(([quantity, from, to]) => {
  stacks[to-1].push(...stacks[from-1].splice(-1*quantity));
});

topCrates = stacks.reduce((msg, stack) => msg + stack.at(-1), "");
console.log("Part 2 message: " + topCrates);
