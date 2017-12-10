function range(length, start = 0) {
  return (new Array(length)).fill(0).map((v, i) => (start + i));
}

function tieKnot(lengths, list = 256, numRounds = 1, position = 0, skip = 0) {
  if (typeof lengths === 'string') {
    lengths = lengths.trim().split(',').map(v => parseInt(v, 10));
  }
  if (typeof list === 'number') {
    list = range(list);
  }
  const listLength = list.length;
  range(numRounds).forEach(() => {
    lengths.forEach(length => {
      if (length > listLength) {
        console.log('invalid length');
        return;
      }
      const halfLength = Math.floor(length / 2);
      for (let i = 0; i < halfLength; i++) {
        const a = (position + i) % listLength;
        const b = (position + length - (i + 1)) % listLength;
        const swap = list[a];
        list[a] = list[b];
        list[b] = swap;
      }
      position = (position + length + skip) % listLength;
      skip += 1;
    });
  });
  return list;
}

function stringToAscii(input) {
  return (new Array(input.length)).fill()
    .map((v, i) => input.charCodeAt(i))
    .concat([17, 31, 73, 47, 23]);
}

function productFirstTwo(lengths, list) {
  const [a, b] = tieKnot(lengths, list);
  return a * b;
}

function tieNastyKnot(lengths, list, position) {
  return tieKnot(stringToAscii(lengths), list, 64)
    .reduce((dense, v, i) => {
      const pos = Math.floor(i / 16);
      if (i % 16 === 0) {
        dense[pos] = v;
      } else {
        dense[pos] ^= v;
      }
      return dense;
    }, [])
    .map(v => {
      let out = v.toString(16);
      while (out.length < 2) {
        out = `0${out}`;
      }
      return out;
    })
    .join('');
}

function testA(lengths, list, expectedResult) {
  const actualResult = productFirstTwo(lengths, list);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

function testB(lengths, list, expectedResult) {
  const actualResult = tieNastyKnot(lengths, list);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

testA('3, 4, 1, 5', 5, 12);

testB('', 256, 'a2582a3a0e66e6e86e3812dcb672a272');
testB('AoC 2017', 256, '33efeb34ea91902bb2f59c9920caa6cd');
testB('1,2,3', 256, '3efbe78a8d82f29979031a4aa0b16a9d');
testB('1,2,4', 256, '63960835bcdc130f0b66d7ff4f6a5a8e');

let input = process.argv[2];

if (input == null) {
  try {
    input = require('fs').readFileSync(`${__dirname}/_day10.txt`).toString();
  } catch (e) {
    console.log('Could not read input!');
  }
}

if (input != null) {
  console.log('Answer A:', productFirstTwo(input));
  console.log('Answer B:', tieNastyKnot(input));
}
