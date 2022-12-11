var fs = require("fs"),
  path = require("path");

const filepath = path.join(__dirname, "input.txt");
const data = fs.readFileSync(filepath).toString().trimEnd();

function initMonkeys() {
  return data.split("\n\n")
    .map(g => g.trim().split('\n')
      .map(l => l.split(":").map(p => p.trim()))
    )
    .map((parts,id) => {
      const [,,arg1,op,arg2] = parts[2][1].split(" ");
      const [trueMonkey, falseMonkey] = [4,5].map(lid => parseInt(parts[lid][1].split(" ").at(-1)));
      const divisor = parseInt(parts[3][1].split(" ").at(-1));

      return {
        id,
        items: parts[1][1].split(" ").map(i => parseInt(i)),
        nextMonkey: (lvl) => ((lvl % divisor === 0) ? trueMonkey : falseMonkey),
        inspect: (lvl) => {
          const operand1 = arg1==="old" ? lvl : parseInt(arg1);
          const operand2 = arg2==="old" ? lvl : parseInt(arg2);
          if (op==="*") return operand1 * operand2;
          if (op==="+") return operand1 + operand2;
        },
        inspections: 0,
        divisor,
      };
    });
}

// Part 1
(function () {
  const monkeys = initMonkeys();
  
  for (let round = 0; round < 20; round++) {
    monkeys.forEach(monkey => {
      while (monkey.items.length > 0) {
        monkey.inspections++;
        const itm_level = Math.floor(monkey.inspect(monkey.items.shift()) / 3);
        monkeys[monkey.nextMonkey(itm_level)].items.push(itm_level)
      }
    });
  }
  
  const monkeyBusiness = monkeys.sort((a,b) => a.inspections - b.inspections).slice(-2).reduce((a,m) => a*m.inspections,1);
  console.log(`Total monkey business: ${monkeyBusiness}`);
})();


// Part 2
(function () {
  const monkeys = initMonkeys();
  const lcm = monkeys.reduce((a,m) => a*m.divisor, 1); // The trick to keep numbers from overflowing
  for (let round = 0; round < 1e4; round++) {
    monkeys.forEach((monkey, mid) => {
      while (monkey.items.length > 0) {
        monkey.inspections++;
        const itm_level = monkey.inspect(monkey.items.shift()) % lcm;
        monkeys[monkey.nextMonkey(itm_level)].items.push(itm_level)
      }
    });

    if ((round+1)%1000 == 0) {
      const monkeyBusiness = monkeys.sort((a,b) => a.inspections - b.inspections).slice(-2).reduce((a,m) => a*m.inspections,1);
      console.log(`Round ${round+1} monkey business: ${monkeyBusiness}`);      
      monkeys.sort((a,b) => a.id - b.id); // intermediate result log changed sorts monkey order inplace ....
    }
  }
  
  const monkeyBusiness = monkeys.sort((a,b) => a.inspections - b.inspections).slice(-2).reduce((a,m) => a*m.inspections,1);
  console.log(`Total monkey business: ${monkeyBusiness}`);
})();
