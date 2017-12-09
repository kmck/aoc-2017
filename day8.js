function parseInstruction(input) {
  [
    ,
    modifyRegister,
    instruction,
    amount,
    compareRegister,
    compareOp,
    compareValue
  ] = input.trim().match(/(\S+)\s+(\S+)\s+(\S+)\s+if\s+(\S+)\s+(\S+)\s+(\S+)/);
  return {
    modifyRegister,
    modifyAmount: instruction === 'dec' ? -parseInt(amount, 10) : parseInt(amount, 10),
    compareRegister,
    compareOp,
    compareValue: parseInt(compareValue, 10)
  };
}

function parseInstructions(input) {
  return input.trim().split(/\n+/).map(parseInstruction);
}

function cmp(l, op, r) {
  switch (op) {
    case '>':
      return l > r;
    case '<':
      return l < r;
    case '>=':
      return l >= r;
    case '<=':
      return l <= r;
    case '==':
      return l == r;
    case '!=':
      return l != r;
    default:
      return false;
  }
}

function maxRegister(registers) {
  return Object.keys(registers).reduce((largest, r) => Math.max(largest, registers[r]), 0);
}

function runInstructions(instructions, registers = {}, afterUpdate) {
  instructions.forEach(({
    modifyRegister,
    modifyAmount,
    compareRegister,
    compareOp,
    compareValue
  }) => {
    if (registers[modifyRegister] == null) {
      registers[modifyRegister] = 0;
    }
    if (registers[compareRegister] == null) {
      registers[compareRegister] = 0;
    }
    if (cmp(registers[compareRegister], compareOp, compareValue)) {
      registers[modifyRegister] += modifyAmount;
      if (typeof afterUpdate === 'function') {
        afterUpdate(registers[modifyRegister]);
      }
    }
  });
  return registers;
}

function runInstructionsAndGetMaxRegister(instructions) {
  if (typeof instructions === 'string') {
    instructions = parseInstructions(instructions);
  }
  const registers = {};
  runInstructions(instructions, registers);
  return maxRegister(registers);
}

function runInstructionsAndGetMaxMemory(instructions) {
  if (typeof instructions === 'string') {
    instructions = parseInstructions(instructions);
  }
  let maxUpdated = 0;
  function afterUpdate(value) {
    maxUpdated = Math.max(value, maxUpdated);
  }
  const registers = {};
  runInstructions(instructions, registers, afterUpdate);
  return Math.max(maxRegister(registers), maxUpdated);
}

function testA(input, expectedResult) {
  const actualResult = runInstructionsAndGetMaxRegister(input);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

function testB(input, expectedResult) {
  const actualResult = runInstructionsAndGetMaxMemory(input);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

testA(`
b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10
`, 1);


testB(`
b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10
`, 10);

let input = process.argv[2];

if (input == null) {
  try {
    input = require('fs').readFileSync(`${__dirname}/_day8.txt`).toString();
  } catch (e) {
    console.log('Could not read input!');
  }
}

if (input != null) {
  console.log('Answer A:', runInstructionsAndGetMaxRegister(input));
  console.log('Answer B:', runInstructionsAndGetMaxMemory(input));
}
