function redistributeBiggestBank(banks) {
  const numBanks = banks.length;
  let index = 0;
  let redistributeBlocks = banks.reduce((max, blocks, i) => {
    if (blocks > max) {
      index = i;
    }
    return Math.max(blocks, max);
  });
  banks[index] = 0;
  while (redistributeBlocks > 0) {
    index = (index + 1) % numBanks;
    banks[index] += 1;
    redistributeBlocks -= 1;
  }
  return banks;
}

function redistributeBanks(banks) {
  const statesSeen = {};
  let counter = 0;
  let stateKey = banks.join(',');
  while (!statesSeen[stateKey]) {
    statesSeen[stateKey] = true;
    redistributeBiggestBank(banks);
    stateKey = banks.join(',');
    counter++;
  }
  return { banks, counter };
}

function countRedistributions(input) {
  if (typeof input === 'string') {
    input = input.trim().split(/\s+/).map(v => parseInt(v, 10));
  }
  return redistributeBanks(input).counter;
}

function findRedistributionLoop(input) {
  if (typeof input === 'string') {
    input = input.trim().split(/\s+/).map(v => parseInt(v, 10));
  }
  const banks = redistributeBanks(input).banks;
  return redistributeBanks(banks).counter;
}

function testA(input, expectedResult) {
  const actualResult = countRedistributions(input);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

function testB(input, expectedResult) {
  const actualResult = findRedistributionLoop(input);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

testA('0 2 7 0', 5);
testA('2 4 1 2', 4);

testB([0, 2, 7, 0], 4);

let input = process.argv[2];

if (input == null) {
  try {
    input = require('fs').readFileSync(`${__dirname}/_day6.txt`).toString();
  } catch (e) {
    console.log('Could not read input!');
  }
}

if (input != null) {
  console.log('Answer A:', countRedistributions(input));
  console.log('Answer B:', findRedistributionLoop(input));
}
