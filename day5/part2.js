import { dayWrapper, useData } from "../common.js";

const testData = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

const { data } = useData(testData);

const getNumbers = str => [...str.matchAll(/(\d+)/g)].map(m => +m[1]);

dayWrapper(() => {
  const [seedsN, ...categories] = data.split('\n\n');
  let seedsRanges = [...seedsN.matchAll(/(\d+) (\d+)/g)]
    .map(m => getNumbers(m[0])).map(([s, r]) => [s, s + r]);

  categories.forEach(category => {
    const ranges = category.split(":\n")[1]
      .split('\n').map(getNumbers);

    const newSeeds = [];
    let found = false;

    while (seedsRanges.length) {
      const [seedStart, seedEnd] = seedsRanges.pop();
      found = false;

      for (const [destination, source, range] of ranges) {
        const overlapStart = Math.max(seedStart, source);
        const overlapEnd = Math.min(seedEnd, source + range);

        if (overlapStart < overlapEnd) {
          newSeeds.push([overlapStart - source + destination, overlapEnd - source + destination]);

          if (overlapStart > seedStart) seedsRanges.push([seedStart, overlapStart]);
          if (seedEnd > overlapEnd) seedsRanges.push([overlapEnd, seedEnd]);
          found = true;
          break;
        }
      }

      if (!found) newSeeds.push([seedStart, seedEnd]);
    }
    seedsRanges = newSeeds;
  })

  return Math.min(...seedsRanges.map(m => m[0]));
})