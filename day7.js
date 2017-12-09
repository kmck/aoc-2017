function parseProgram(input) {
  const [, name, w, sub] = input.trim().match(/(\S+)\s+\((\d+)\)(?:\s+->\s+(.*))?/);
  return {
    name,
    weight: parseInt(w, 10) || 0,
    subprograms: sub ? sub.trim().split(/,/).map(program => program.trim()) : [],
  };
}

function parsePrograms(input) {
  return input.trim().split(/\n+/).map(parseProgram);
}

function parseProgramTree(input) {
  const programs = parsePrograms(input);
  const programsByName = {};
  function setSubprogramParent(childName, parentName) {
    const subprogram = programsByName[childName];
    subprogram.parent = programsByName[parentName];
    return subprogram;
  }

  programs.forEach(program => {
    programsByName[program.name] = program;
  });

  programs.forEach(program => {
    if (program.subprograms) {
      program.subprograms = program.subprograms
        .map(subprogramName => setSubprogramParent(subprogramName, program.name));
    }
  });

  return programs.reduce((root, program) => (program.parent ? root : program), null);
}

function getRootProgram(input) {
  return parseProgramTree(input).name;
}

function weighChildren(program, out = {}) {
  program.totalWeight = program.weight;
  if (program.subprograms && program.subprograms.length) {
    program.subprograms.forEach((subprogram, i) => {
      program.totalWeight += weighChildren(subprogram, out);
    });
    const subprogramsByWeight = program.subprograms.slice(0)
      .sort((a, b) => a.totalWeight > b.totalWeight ? 1 : -1);
    const {
      totalWeight: desiredSubWeight
    } = subprogramsByWeight[Math.floor(subprogramsByWeight.length / 2)];
    program.subprograms.forEach((subprogram, i) => {
      const weightOffset = desiredSubWeight - subprogram.totalWeight;
      if (weightOffset !== 0) {
        // Assuming there's only one bad weight, the first one we mark is the right one
        if (!out.unbalancedProgram) {
          out.unbalancedProgram = subprogram;
          out.desiredWeight = subprogram.weight + weightOffset;
        }
      }
    });
  }
  return program.totalWeight;
}

function findUnbalancedProgram(input) {
  const root = parseProgramTree(input);
  const withoutParent = node => {
    const newNode = Object.assign({}, node);
    delete newNode.parent;
    if (node.subprograms) {
      newNode.subprograms = node.subprograms.map(withoutParent);
    }
    return newNode;
  };
  const out = {};
  weighChildren(root, out);
  return out.desiredWeight;
}

function testA(input, expectedResult) {
  const actualResult = getRootProgram(input);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

function testB(input, expectedResult) {
  const actualResult = findUnbalancedProgram(input);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

function generateProgramTree(program, depth = 0) {
  const pad = amount => (new Array(Math.max(0, amount))).fill(0).map(() => ' ').join('');
  let text = [
    pad(2 * depth)},
    `${depth}.`,
    program.name,
    pad(20 - program.name.length - 2 * depth),
    `(${program.weight})`
    program.totalWeight != null ? `[total ${program.totalWeight}]` : ''
  ].filter(v => v).join(' ');

  if (program.subprograms) {
    text += program.subprograms
      .map(subprogram => `\n${generateProgramTree(subprogram, depth + 1)}`)
      .join('');
  }

  return text;
}

function printProgramTree(program) {
  console.log(generateProgramTree(program));
}

testA(`
pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)
`, 'tknk');

testB(`
pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)
`, 60);

let input = process.argv[2];

if (input == null) {
  try {
    input = require('fs').readFileSync(`${__dirname}/_day7.txt`).toString();
  } catch (e) {
    console.log('Could not read input!');
  }
}

if (input != null) {
  // {
  //   const root = parseProgramTree(input);
  //   weighChildren(root);
  //   printProgramTree(root);
  // }
  console.log('Answer A:', getRootProgram(input));
  console.log('Answer B:', findUnbalancedProgram(input));
}
