var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

let list = data.split("\n").map(l => parseInt(l));

// Part 1
function mix(list) {
  let indices = list.map((v,index) => index);
  
  while (indices.length > 0) {
    const oldIdx = indices.shift();
    const value = list[oldIdx];
    let newIdx = oldIdx + value;
    if (newIdx > list.length) {
      newIdx = (newIdx + 1) % list.length;
    } else if (newIdx < 0) {
      newIdx = newIdx + Math.ceil(-1*newIdx/list.length)*list.length - 1;
    }
  
    if (newIdx < 0) {
      console.log("Wrong index");
    }
  
    let newList = [];
    if (newIdx > oldIdx) {
      newList = [].concat(
        list.slice(0, oldIdx),
        list.slice(oldIdx+1, newIdx+1),
        value,
        list.slice(newIdx+1)
      );
      indices = indices.map(v => (v <= newIdx && v > oldIdx) ? v-1 : v)
    } else if (newIdx < oldIdx) {
      newList = [].concat(
        list.slice(0, newIdx),
        value,
        list.slice(newIdx, oldIdx),
        list.slice(oldIdx+1)
      );
      indices = indices.map(v => (v >= newIdx && v < oldIdx) ? v+1 : v)
    } else {
      console.log("Same index?");
      newList = list;
    }
    console.log("Processed value: " + value);
    list = newList;
  }
  return list;
}

let mixedList = mix(list);
let idx_0 = mixedList.findIndex((v) => v === 0);
let nums = [1e3,2e3,3e3].map((n) => mixedList[(idx_0+n) % mixedList.length]);
let sum = [1e3,2e3,3e3].reduce((prev, n) => prev + mixedList[(idx_0+n) % mixedList.length], 0)

console.log("Part 1: " + sum);
