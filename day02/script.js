var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
let data = fs.readFileSync(filepath).toString();
let input_data = data.trim().split("\n").map(l => l.split(" "));

const encoding = {"A": 0, "B": 1, "C": 2, "X": 0, "Y": 1, "Z": 2};
const encoded_rounds = input_data.map(([opp, you]) => [encoding[opp], encoding[you]]);

// PART1 - input opp choice, player choice
let score = encoded_rounds.map(([p1, p2]) => (p2+1) + 3*((3+ (p2+1)-p1) % 3)).reduce((a,b) => a+b);
console.log(`Part 1 score: ${score}`);

// PART2 - work backwards from opp choice, result
score = encoded_rounds.map(([p1, r]) => 1 + (3 + p1 + (r-1)) % 3 + 3*r).reduce((a,b) => a+b);
console.log(`Part 2 score: ${score}`);
