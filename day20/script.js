var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

let list = data.split("\n").map(l => parseInt(l));

function mix(list, iterations=1) {
  let indices = [...list.keys()];
  
  for (let iteration=0; iteration < iterations; iteration++) {
    for (let i = 0; i < indices.length; i++) {
      const oldIdx = indices[i];
      let newIdx = oldIdx + list[i];
      if (newIdx > list.length) {
        newIdx = newIdx % (list.length-1);
      } else if (newIdx < 0) {
        newIdx = newIdx + Math.ceil(-1*newIdx/(list.length-1))*(list.length - 1);
      }
    
      if (newIdx > oldIdx) {
        indices = indices.map(v => (v <= newIdx && v > oldIdx) ? v-1 : v)
      } else if (newIdx < oldIdx) {
        indices = indices.map(v => (v >= newIdx && v < oldIdx) ? v+1 : v)
      }
      indices[i] = newIdx;
    }
  }

  // Rebuild list with new positions
  let mixedList = new Array(indices.length);
  indices.forEach((newIdx,oldIdx) => mixedList[newIdx] = list[oldIdx]);
  let idx_0 = mixedList.findIndex((v) => v === 0);
  return [1e3,2e3,3e3].reduce((prev, n) => prev + mixedList[(idx_0+n) % mixedList.length], 0);;
}

// Part 1
console.log("Part 1: " + mix(list, 1));  

// Part 2
const decriptionKey = 811589153;
console.log("Part 2: " + mix(list.map(v => v*decriptionKey), 10));  
