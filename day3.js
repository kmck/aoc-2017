const RIGHT = 0;
const UP = 1;
const LEFT = 2;
const DOWN = 3;

function positionToKey(x, y) {
  return `${x}_${y}`;
}

function numberedSquares(i) {
  return i + 1;
}

function adjacentSquareSum(i, x, y, squares, getIndex) {
  if (i === 0) {
    return 1;
  }
  return [
    getIndex(x - 1, y - 1),
    getIndex(x, y - 1),
    getIndex(x + 1, y - 1),
    getIndex(x - 1, y),
    getIndex(x, y),
    getIndex(x + 1, y),
    getIndex(x - 1, y + 1),
    getIndex(x, y + 1),
    getIndex(x + 1, y + 1),
  ].reduce((sum, index) => (
    (index in squares)
      ? (sum + squares[index].value)
      : sum
  ), 0);
}

function continueUntilIndexPlusOne(square, input) {
  return numberedSquares(square.i) < input;
}

function continueUntilValue(square, input) {
  return square.value < input;
}

function * createSpiral({
  generateValue = numberedSquares,
  squares = [],
  positionToIndex = {}
} = {}) {
  const getIndex = (x, y) => positionToIndex[positionToKey(x, y)];
  let x = 0;
  let y = 0;
  let i = 0;
  let direction = 0;
  while (true) {
    positionToIndex[positionToKey(x, y)] = i;
    const value = generateValue(i, x, y, squares, getIndex);
    const square = { i, x, y, value };
    squares.push(square);
    yield square;
    switch (direction) {
      case RIGHT:
        x += 1;
        if (x === y + 1) {
          direction = UP;
        }
        break;
      case UP:
        y -= 1;
        if (y === -x) {
          direction = LEFT;
        }
        break;
      case LEFT:
        x -= 1;
        if (x === y) {
          direction = DOWN;
        }
        break;
      case DOWN:
        y += 1;
        if (y === -x) {
          direction = RIGHT;
        }
        break;
      default:
        break;
    }
    i++;
  }

  return {
    squareToPosition: square => squareToPosition[square],
    positionToSquare: (x, y) => positionToSquare[positionToKey(x, y)],
  };
}

function spiralManhattanDistance(input, shouldContinue = continueUntilValue) {
  const spiral = createSpiral({ generateValue: numberedSquares });
  let square;
  do {
    square = spiral.next().value;
  } while (shouldContinue(square, input));
  return Math.abs(square.x) + Math.abs(square.y);
}

function spiralSquareValue(input, shouldContinue = continueUntilValue) {
  const spiral = createSpiral({ generateValue: adjacentSquareSum });
  let square;
  do {
    square = spiral.next().value;
  } while (shouldContinue(square, input));
  return square.value;
}

function testA(input, expectedResult) {
  const actualResult = spiralManhattanDistance(input, continueUntilValue);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

function testB(input, expectedResult) {
  const actualResult = spiralSquareValue(input, continueUntilIndexPlusOne);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

testA(1, 0);
testA(12, 3);
testA(23, 2);
testA(1024, 31);

testB(1, 1);
testB(2, 1);
testB(3, 2);
testB(4, 4);
testB(5, 5);
testB(6, 10);
testB(7, 11);
testB(8, 23);
testB(9, 25);
testB(10, 26);
testB(11, 54);
testB(12, 57);
testB(13, 59);
testB(14, 122);
testB(15, 133);
testB(16, 142);
testB(17, 147);
testB(18, 304);
testB(19, 330);
testB(20, 351);
testB(21, 362);
testB(22, 747);
testB(23, 806);

let input = process.argv[2];

if (input == null) {
  try {
    input = require('fs').readFileSync(`${__dirname}/_day3.txt`).toString();
  } catch (e) {
    console.log('Could not read input!');
  }
}

if (input != null) {
  console.log('Answer A:', spiralManhattanDistance(input));
  console.log('Answer B:', spiralSquareValue(input));
}
