function parseStream(input) {
  const items = [];
  const stack = [];
  const inputLength = input.length;
  for (let i = 0; i < inputLength; i++) {
    const character = input[i];
    const currentItem = stack.length ? stack[stack.length - 1] : null;

    switch (currentItem && currentItem.type) {
      // cancel next character
      case 'cancel': {
        const item = stack.pop();
        item.end = i;
        item.canceled = character;
        item.content = input.substring(item.start, item.end + 1);
        const outerItem = stack.length ? stack[stack.length - 1] : null;
        if (outerItem && outerItem.type === 'garbage' && outerItem.canceled) {
          outerItem.canceled.push(character);
        } else {
          console.log('something is wrong', outerItem);
        }
        break;
      }

      // collecting garbage
      case 'garbage': {
        switch (character) {
          // ignore next
          case '!': {
            const item = {};
            item.type = 'cancel';
            item.start = i;
            items.push(item);
            stack.push(item);
            break;
          }
          // close garbage
          case '>': {
            const item = stack.pop();
            item.end = i;
            item.content = input.substring(item.start, item.end + 1);
            continue;
          }
          default:
            break;
        }
        break;
      }

      // collecting groups
      case 'group':
      default: {
        switch (character) {
          // open group
          case '{': {
            const item = {};
            item.type = 'group';
            item.start = i;
            item.children = [];
            // Add to the current group, if there is one
            if (currentItem) {
              if (!(currentItem.type === 'group' && currentItem.children)) {
                console.log('something is wrong', currentItem);
              }
              currentItem.children.push(item);
              item.score = currentItem.score + 1;
            } else {
              item.score = 1;
            }
            items.push(item);
            stack.push(item);
            break;
          }
          // close group
          case '}': {
            const item = stack.pop();
            item.end = i;
            item.content = input.substring(item.start, item.end + 1);
            break;
          }
          // open garbage
          case '<': {
            const item = {};
            item.type = 'garbage';
            item.start = i;
            item.canceled = [];
            items.push(item);
            stack.push(item);
            break;
          }
          default:
            break;
        }
        break;
      }
    }
  }
  return items;
}

function tallyScore(group) {
  return group.score + group.children.reduce((score, child) => (score + tallyScore(child)), 0);
}

function parseStreamAndScoreGroups(input) {
  const items = parseStream(input);
  const groups = items.filter(item => item.type === 'group');
  // console.log('------------------');
  // console.log(JSON.stringify(items, null, 2));
  // console.log(JSON.stringify(groups[0], null, 2));
  return tallyScore(groups[0]);
};

function parseStreamAndMeasureGarbage(input) {
  const items = parseStream(input);
  const garbage = items.filter(item => item.type === 'garbage');
  const canceled = items.filter(item => item.type === 'cancel');
  // console.log(JSON.stringify(garbage, null, 2));
  // console.log(JSON.stringify(canceled, null, 2));
  return garbage.reduce((count, item) => (count + item.content.length - 2 * (1 + item.canceled.length)), 0);
}

function testA(input, expectedResult) {
  const actualResult = parseStreamAndScoreGroups(input);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

function testB(input, expectedResult) {
  const actualResult = parseStreamAndMeasureGarbage(input);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

// testA('{}', 1);
// testA('{{{}}}', 6);
// testA('{{},{}}', 5);
// testA('{{{},{},{{}}}}', 16);
// testA('{<a>,<a>,<a>,<a>}', 1);
// testA('{{<ab>},{<ab>},{<ab>},{<ab>}}', 9);
// testA('{{<!!>},{<!!>},{<!!>},{<!!>}}', 9);
// testA('{{<a!>},{<a!>},{<a!>},{<ab>}}', 3);

// testB('<>', 0);
// testB('<random characters>', 17);
// testB('<<<<>', 3);
// testB('<{!>}>', 2);
// testB('<!!>', 0);
// testB('<!!!>>', 0);
// testB('<{o"i!a,<{i<a>', 10);

let input = process.argv[2];

if (input == null) {
  try {
    input = require('fs').readFileSync(`${__dirname}/_day9.txt`).toString();
  } catch (e) {
    console.log('Could not read input!');
  }
}

if (input != null) {
  // console.log('Answer A:', parseStreamAndScoreGroups(input));
  console.log('Answer B:', parseStreamAndMeasureGarbage(input));
}
