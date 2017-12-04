function identity(word) {
  return word;
}

function alphabetizeLetters(word) {
  return word.split('').sort((a, b) => (a > b ? 1 : -1)).join('');
}

function isValidPassword(input, wordToKey = identity) {
  const words = {};
  let isValid = true;
  input.trim().split(/\s+/)
    .map(wordToKey)
    .forEach(word => {
      if (word in words) {
        isValid = false;
        words[word] += 1;
      } else {
        words[word] = 1;
      }
    });
  return isValid;
}

function countValidPasswords(input, wordToKey = identity) {
  return input.trim().split(/\n/)
    .reduce((sum, password) => (isValidPassword(password, wordToKey) ? (sum + 1) : sum), 0);
}

function test(input, expectedResult, wordToKey = identity) {
  const actualResult = isValidPassword(input, wordToKey);
  const passed = expectedResult === actualResult;
  console.log(`${passed ? 'PASS' : 'FAIL'}! ${expectedResult} === ${actualResult}`);
}

test('aa bb cc dd ee', true, identity);
test('aa bb cc dd aa', false, identity);
test('aa bb cc dd aaa', true, identity);

test('abcde fghij', true, alphabetizeLetters);
test('abcde xyz ecdab', false, alphabetizeLetters);
test('a ab abc abd abf abj', true, alphabetizeLetters);
test('iiii oiii ooii oooi oooo', true, alphabetizeLetters);
test('oiii ioii iioi iiio', false, alphabetizeLetters);

let input = process.argv[2];

if (input == null) {
  try {
    input = require('fs').readFileSync(`${__dirname}/_day4.txt`).toString();
  } catch (e) {
    console.log('Could not read input!');
  }
}

if (input != null) {
  console.log('Answer A:', countValidPasswords(input, identity));
  console.log('Answer B:', countValidPasswords(input, alphabetizeLetters));
}
