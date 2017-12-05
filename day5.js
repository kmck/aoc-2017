function transformValueA(value) {
  return value + 1;
}

function transformValueB(value) {
  if (value >= 3) {
    return value - 1;
  } else {
    return value + 1;
  }
}

function countStepsToExit(input, transformValue = transformValueA) {
  if (typeof input === 'string') {
    input = input.trim().split(/\n/).map(v => parseInt(v, 10));
  }
  const inputLength = input.length;
  let offset = 0;
  let steps = 0;
  do {
    const nextOffset = offset + input[offset];
    input[offset] = transformValue(input[offset]);
    steps += 1;
    offset = nextOffset;
  } while (offset >= 0 && offset < inputLength);
  return steps;
}

function test(input, expectedResult, transformValue) {
  const actualResult = countStepsToExit(input, transformValue);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

test(`
0
3
0
1
-3
`, 5, transformValueA);

test(`
0
3
0
1
-3
`, 10, transformValueB);

let input = process.argv[2];

if (input == null) {
  try {
    input = require('fs').readFileSync(`${__dirname}/_day5.txt`).toString();
  } catch (e) {
    console.log('Could not read input!');
  }
}

if (input != null) {
  console.log('Answer A:', countStepsToExit(input, transformValueA));
  console.log('Answer B:', countStepsToExit(input, transformValueB));
}
