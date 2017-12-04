function sumSame(input, offset = 1) {
  if (typeof input === 'number') {
    input = `${input}`;
  }
  let sum = 0;
  const inputLength = input.length;
  if (!inputLength) {
    return sum;
  }
  if (typeof offset === 'function') {
    offset = offset(input);
  }
  for (let i = 0; i < inputLength; i++) {
    if (input[i] === input[(i + offset) % inputLength]) {
      sum += parseInt(input[i], 10);
    }
  }
  return sum;
}

function offsetHalfLength(input) {
  return Math.ceil(input.length / 2);
}

function test(input, expectedResult, offset) {
  const actualResult = sumSame(input, offset);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

test('1122', 3, 1);
test('1111', 4, 1);
test('1234', 0, 1);
test('91212129', 9, 1);

test('1212', 6, offsetHalfLength);
test('1221', 0, offsetHalfLength);
test('123425', 4, offsetHalfLength);
test('123123', 12, offsetHalfLength);
test('12131415', 4, offsetHalfLength);

let input = process.argv[2];

if (input == null) {
  try {
    input = require('fs').readFileSync(`${__dirname}/_day1.txt`).toString();
  } catch (e) {
    console.log('Could not read input!');
  }
}

if (input != null) {
  console.log('Answer A:', sumSame(input, 1));
  console.log('Answer B:', sumSame(input, offsetHalfLength));
}
