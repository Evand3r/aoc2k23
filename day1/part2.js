import { dayWrapper, useData } from "../common.js";

const testData = `two1nine
abc
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`;
const { data } = useData(testData);

dayWrapper(() => {
  const numberDict = {
    "one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9"
  }

  return data.split("\n")
    .map(l => Array.from(l.matchAll(/(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g), match => match[1]))
    .filter(n => n.length)
    .reduce((acc, n) => {
      let n1 = n[0];
      let n2 = n.at(-1);

      if (isNaN(n1)) n1 = numberDict[n1];
      if (isNaN(n2)) n2 = numberDict[n2];

      return acc + +(n1 + n2);
    }, 0)
})
