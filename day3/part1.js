import { dayWrapper, useData } from '../common.js';

const testData = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

const { data } = useData(testData);

dayWrapper(() => {
  const numbers = new Set();
  const gridLines = data.split('\n').filter(line => !!line);

  gridLines.forEach((line, lineIndex) => {
    if (!/[^\w|\.]/g.test(line)) return; //Ignore lines without symbols

    line.split('').forEach((char, charIndex) => {
      if (char.match(/[\d|\.]/)) return; //Ignore digits and dots

      for (const currentRow of [lineIndex - 1, lineIndex, lineIndex + 1]) {
        for (let currentColumn of [charIndex - 1, charIndex, charIndex + 1]) {
          if (
            currentRow < 0 || currentRow >= gridLines.length
            || currentColumn < 0 || currentColumn >= line.length
            || !gridLines[currentRow][currentColumn].match(/\d/)
          ) {
            continue;
          }
          while (currentColumn > 0 && gridLines[currentRow][currentColumn - 1].match(/\d/)) currentColumn--;
          numbers.add(`${currentRow},${currentColumn}`);
        }
      }
    })
  })

  return Array.from(numbers.values()).reduce((sum, coordinates) => {
    const [row, col] = coordinates.split(',');
    const number = +gridLines[row].slice(col).match(/\d+/);

    return sum + number;
  }, 0)
})