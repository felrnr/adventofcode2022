var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
let data = fs.readFileSync(filepath).toString().trimEnd();

// Part 1
function findMarker(data, size) {
  for (let i = 0; i < data.length-(size-1); i++) {
    const unique_characters = new Set(data.slice(i, i+size))
    if (unique_characters.size === size) return i+size;
  }
  
  return -1;
}

console.log(`Found packet marker after character: ${findMarker(data, 4)}`);

// Part 2
console.log(`Found message marker after character: ${findMarker(data, 14)}`);
