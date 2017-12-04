function checksumRowA(row) {
  let highest = null;
  let lowest = null;
  row.forEach(num => {
    if (lowest == null || num < lowest) {
      lowest = num;
    }
    if (highest == null || num > highest) {
      highest = num;
    }
  });
  return highest - lowest;
}

function checksumRowB(row) {
  let sum = 0;
  const rowSorted = row.slice().sort((a, b) => (a > b ? 1 : -1)).reverse();
  const rowLength = rowSorted.length;
  rowSorted.forEach((higher, i) => {
    for (let j = i + 1; j < rowLength; j++) {
      const lower = rowSorted[j];
      if (higher % lower === 0) {
        sum += higher / lower;
      }
    }
  });
  return sum;
}

function checksumSpreadsheet(input, checksumRow = checksumRowA) {
  if (typeof input === 'string') {
    input = input.trim().split(/\n+/)
      .map(row => (
        row.trim().split(/\s+/)
          .map(num => parseInt(num, 10))
      ));
  }

  return input.reduce((sum, row) => (sum + checksumRow(row)), 0);
}

function testA(input, expectedResult) {
  const actualResult = checksumSpreadsheet(input, checksumRowA);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

function testB(input, expectedResult) {
  const actualResult = checksumSpreadsheet(input, checksumRowB);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

testA(`
5 1 9 5
7 5 3
2 4 6 8
`, 18);

testB(`
5 9 2 8
9 4 7 3
3 8 6 5
`, 9)

testB(`
12 2
12 2
12 2
`, 18)

let input = process.argv[2];

if (input == null) {
  try {
    input = require('fs').readFileSync(`${__dirname}/_day2.txt`).toString();
  } catch (e) {
    console.log('Could not read input!');
  }
}

if (input != null) {
  console.log('Answer A:', checksumSpreadsheet(input, checksumRowA));
  console.log('Answer B:', checksumSpreadsheet(input, checksumRowB));
}
