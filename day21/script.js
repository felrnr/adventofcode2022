var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();


function loadMonkeys() {
  let monkeys = data.split("\n")
    .map(l => l.split(": "))
    .map(([code, op]) => [code, op.split(" ")])
    .map(([code, [left, op, right]]) => [code, ((op === undefined) ? { constant: parseInt(left) } : { left, op, right })]);
  let computedValues = {};
  monkeys.filter(([,{constant}]) => constant !== undefined).forEach(([code,{constant}]) => computedValues[code] = constant);
  return { monkeys: Object.fromEntries(monkeys), computedValues };
}

// part 1
function part1() {
  let { computedValues, monkeys } = loadMonkeys();
  function getMonkeyValue(code) {
    if (computedValues[code] !== undefined) return computedValues[code];
  
    const { left, right, op } = monkeys[code];
  
    if (op === "+") computedValues[code] = getMonkeyValue(left) + getMonkeyValue(right);
    if (op === "-") computedValues[code] = getMonkeyValue(left) - getMonkeyValue(right);
    if (op === "*") computedValues[code] = getMonkeyValue(left) * getMonkeyValue(right);
    if (op === "/") computedValues[code] = getMonkeyValue(left) / getMonkeyValue(right);
    
    return computedValues[code];
  }

  console.log("Part1: " + getMonkeyValue("root"));
}
part1();

// Part 2
function part2() {
  let { computedValues, monkeys } = loadMonkeys();
  let humanDependencies = new Set(["humn"]);
  delete computedValues["humn"];

  function getMonkeyValue(code) {
    if (humanDependencies.has(code)) return false;
    if (computedValues[code] !== undefined) return computedValues[code];
  
    const { left, right, op } = monkeys[code];

    const lhs = getMonkeyValue(left);
    const rhs = getMonkeyValue(right);

    if (code === "root") {
      computedValues[code] = (lhs===false) ? rhs : lhs;
      return computedValues[code];
    } else if (lhs === false || rhs === false) {
      humanDependencies.add(code);
      return false;
    }
  
    if (op === "+") computedValues[code] = lhs + rhs;
    if (op === "-") computedValues[code] = lhs - rhs;
    if (op === "*") computedValues[code] = lhs * rhs;
    if (op === "/") computedValues[code] = lhs / rhs;
    
    return computedValues[code];
  }

  // Backfill values in reverse order
  function setMissingValue(code) {
    if (finishFlag) return;
    
    const { left, right, op } = monkeys[code];
    if (humanDependencies.has(left) && humanDependencies.has(right)) {
      console.log("What now??");
    }
    if (left === "humn" || right === "humn") finishFlag = true;

    if (humanDependencies.has(left) && computedValues[left] === undefined) {
      if (code === "root") computedValues[left] = computedValues[code];
      else if (op === "+") computedValues[left] = computedValues[code] - computedValues[right]; // l + r = c  ->  l = c - r
      else if (op === "-") computedValues[left] = computedValues[code] + computedValues[right]; // l - r = c  ->  l = c + r
      else if (op === "*") computedValues[left] = computedValues[code] / computedValues[right]; // l * r = c  ->  l = c / r
      else if (op === "/") computedValues[left] = computedValues[code] * computedValues[right]; // l / r = c  ->  l = c * r
      setMissingValue(left);
    }
    
    if (humanDependencies.has(right) && computedValues[right] === undefined) {
      if (code === "root") computedValues[right] = computedValues[code];
      else if (op === "+") computedValues[right] = computedValues[code] - computedValues[left]; // l + r = c  ->  r = c - l
      else if (op === "-") computedValues[right] = computedValues[left] - computedValues[code]; // l - r = c  ->  r = l - c
      else if (op === "*") computedValues[right] = computedValues[code] / computedValues[left]; // l * r = c  ->  r = c / l
      else if (op === "/") computedValues[right] = computedValues[left] / computedValues[code]; // l / r = c  ->  r = l / c
      setMissingValue(right);
    }
  }
  
  let finishFlag = false;
  getMonkeyValue("root");
  setMissingValue("root");
  console.log(`Human value: ${computedValues["humn"]}. Root monkey value: ${computedValues["root"]}`);
}

part2();
