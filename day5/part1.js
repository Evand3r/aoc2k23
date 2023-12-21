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

const getNumbers = str => Array.from(str.matchAll(/(\d+)/g), m => +m[1])

dayWrapper(() => {
  const [seedsN, ...categories] = data.split('\n\n');
  const seeds = getNumbers(seedsN.split('\n')[0]);

  function mapToCategory(ranges, val) {
    return ranges.reduce((acc, [destination, source, range]) => {
      if (val >= source && val < source + range) {
        return Math.abs(acc - source) + destination;
      }
      return acc;
    }, val)
  }

  const categoryRanges = categories.map((category) => {
    return category.split(':\n')[1]
      .split('\n')
      .map(getNumbers)
  });

  const locations = seeds.map(seed => {
    return categoryRanges.reduce(
      (translatedSeed, catRange) => mapToCategory(catRange, translatedSeed), seed
    );
  });

  return Math.min(...locations);
})