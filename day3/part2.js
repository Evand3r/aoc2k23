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
  const numbers = new Map();
  const gridLines = data.split('\n').filter(line => !!line);

  gridLines.forEach((line, lineIndex) => {
    if (!/[^\w|\.]/g.test(line)) return; //Ignore lines without symbols

    line.split('').forEach((char, charIndex) => {
      if (char.match(/[\d|\.]/)) return; //Ignore digits and dots
      const charCoordinates = char + `-${lineIndex},${charIndex}`;

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

          if (numbers.has(charCoordinates)) {
            numbers.get(charCoordinates).add(`${currentRow},${currentColumn}`)
          } else {
            const set = new Set();
            numbers.set(charCoordinates, set.add(`${currentRow},${currentColumn}`));
          }
        }
      }
    })
  })

  //Could use some refactoring
  return Array.from(numbers.values())
    .filter(set => set.size === 2)
    .reduce((sum, duple) => {
      const [val1, val2] = Array.from(duple.values(), val => {
        const [row, col] = val.split(',');
        return +gridLines[row].slice(col).match(/\d+/);
      });

      return sum + (val1 * val2);
    }, 0)
})