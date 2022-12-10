var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

const instructions = data.split("\n").map((l) => l.trim().split(" "));

// Part 1:
let state = { tick: 0, x: 1, signalStrength: 0 }
instructions.forEach(([op, ...args]) => {
    const ticks = (op === "addx") ? 2 : 1;
    state.tick += ticks;
    const extraTicks = (state.tick + 20) % 40;
    if (extraTicks < ticks) state.signalStrength += state.x * (state.tick - extraTicks);
    if (op === "addx") state.x += parseInt(args[0]);
  } 
);
console.log(`Total signal strength: ${state.signalStrength}`);

// Part 2:
state = { x: 1, tick: 0, row: new Array(40).fill("."), crt: 0 };
function draw() {
  if (Math.abs(state.crt - state.x) <= 1) state.row[state.crt] = "#";
  if (++state.crt === 40) {
    state.crt = 0;
    console.log(state.row.join(""));
    state.row.fill(".");
  }
}
instructions.forEach(([op, ...args]) => {
    draw();
    if (op === "addx") {
      draw();
      state.x += parseInt(args[0]);
    }
  });
