var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

const jetPattern = data.split("");

const AIR = ".";
const ROCK = "#";

const PIECES = [
  {name: "-", width: 4, height: 1, mask: [[0,0],[1,0],[2,0],[3,0]]},
  {name: "+", width: 3, height: 3, mask: [[0,1],[1,0],[1,1],[1,2],[2,1]]},
  {name: "J", width: 3, height: 3, mask: [[2,0],[2,1],[0,2],[1,2],[2,2]]},
  {name: "|", width: 1, height: 4, mask: [[0,0],[0,1],[0,2],[0,3]]},
  {name: "#", width: 2, height: 2, mask: [[0,0],[0,1],[1,0],[1,1]]},
];

function simulate(iterations, debug=false) {
  let highestPoint = -1;
  let chamber = new Array(5000).fill().map(() => new Array(7).fill(AIR));
  let jetCounter = 0;

  for (let i = 0; i < iterations; i++) {
    let piece = PIECES[i % PIECES.length];
    let x0 = 2;
    let y0 = highestPoint + piece.height + 3;
    if (debug) console.log(`Iteration ${i+1} / ${iterations}. New rock piece with shape ${piece.name}`);
    
    while (true) {
      // jet step
      let jetDirection = jetPattern[jetCounter];
      jetCounter = (jetCounter+1) % jetPattern.length;
      let dx = (jetDirection===">") ? 1 : -1;

      let violatedSegment = piece.mask.find(([x,y]) => {
        // out of bounds?
        let x_new =  x0 + x + dx;
        if (x_new < 0 || x_new > 6) return true;
        
        // overlapping existing rock?
        if (chamber[y0-y][x_new] === ROCK) return true;
        return false;
      });

      if (debug) console.log(`Rock movement in direction ${jetDirection} possible? ${violatedSegment===undefined}`);
      if (violatedSegment === undefined) {
        x0 += dx;
      }
      
      // fall step
      let dy = -1;
      violatedSegment = piece.mask.find(([x,y]) => {
        // out of bounds?
        if (y0 - y + dy < 0) return true;
        
        // overlapping existing rock?
        if (chamber[y0-y+dy][x0+x] === ROCK) return true;
        return false;
      });

      if (debug) console.log(`Rock falling possible? ${violatedSegment===undefined}`);
      if (violatedSegment === undefined) {
        y0 += dy;
      } else {
        break; // resting place for this rock.
      }
    }

    // Place rock
    piece.mask.forEach(([x,y]) => chamber[y0-y][x0+x] = ROCK);
    if (y0 > highestPoint) highestPoint = y0;
    if (debug) drawChamber(chamber,highestPoint);
  }

  console.log(`Total height of the rock formation after ${iterations} iterations = ${highestPoint+1}`);
}

function drawChamber(chamber, startingHeight) {
  for (let i = startingHeight+1; i >= 0; i--) {
    console.log("|"+chamber[i].join("")+"| " + i)
  }
  console.log("+-------+");
}

// Part 1
simulate(2022, debug=false);
