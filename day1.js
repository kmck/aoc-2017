function sumSame(input) {
  if (typeof input === 'number') {
    input = `${input}`;
  }
  let sum = 0;
  const inputLength = input.length;
  if (!inputLength) {
    return sum;
  }
  for (let i = 0; i < inputLength; i++) {
    if (input[i] === input[(i + 1) % inputLength]) {
      sum += parseInt(input[i], 10);
    }
  }
  return sum;
}

function test(input, expectedResult) {
  const actualResult = sumSame(input);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

test('1122', 3);
test('1111', 4);
test('1234', 0);
test('91212129', 9);

let input = process.argv[2];

if (input == null) {
  try {
    input = require('fs').readFileSync(`${__dirname}/_day1.txt`).toString();
  } catch (e) {
    console.log('Could not read input!');
  }
}

if (input != null) {
  console.log('Answer:', sumSame(input));
}
