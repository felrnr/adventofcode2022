var fs = require('fs'),
  path = require('path');

const filepath = path.join(__dirname, "input.txt");
let data = fs.readFileSync(filepath).toString();

let sets = data.split('\n\n')
                .map(v => v.split('\n')
                    .map(n => parseInt(n.trim()))
                    .filter(n => !isNaN(n)))
                .map(food => ({
                    food, 
                    total: food.reduce((a,b) => a+b),
                }));
                
sets.sort((a,b) => a.total - b.total).reverse()

// PART A
console.log(`Max elf: ${sets[0].total}, with food: ${sets[0].food}`);

// PART B
const top3calories = sets.slice(0,3).reduce((a,b) => a + b.total, 0);

console.log(`Top 3: ${top3calories}`);
