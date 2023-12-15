import { dayWrapper, useData } from "../common.js";

const testData = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;

const { data } = useData(testData);

dayWrapper(() => data.split('\n')
  .filter(line => !!line)
  .reduce((sum, game) => {
    const localMax = {
      red: 0,
      green: 0,
      blue: 0,
    }

    Array.from(game.split(":")[1].matchAll(/(\d+) (\w+)/g))
      .forEach(([_, val, color]) => localMax[color] = Math.max(localMax[color], val))

    return sum + Object.values(localMax)
      .reduce((acc, max) => acc * max, 1);
  }, 0)
);
