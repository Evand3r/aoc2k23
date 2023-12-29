import { dayWrapper, useData } from "../common.js";

const testData = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`;

const { data } = useData(testData);

dayWrapper(() => {
    const nodeLabels = [];
    const counts = [];

    const directions = data.split('\n\n')[0].split('');
    const dict = data.split('\n\n')[1].split('\n').filter(l => !!l).reduce((accMap, line) => {
        const [label, L, R] = Array.from(line.matchAll(/(\w+)/g), m => m[0]);
        if (label.at(-1) === 'A') nodeLabels.push(label);

        return accMap.set(label, { L, R });
    }, new Map())

    for (let currentLabel of nodeLabels) {
        let localCount = 0;

        while (currentLabel.at(-1) !== 'Z') {
            const options = dict.get(currentLabel);
            const direction = directions[localCount % directions.length];

            currentLabel = options[direction];
            localCount++;
        }

        counts.push(localCount);
    }

    return counts;
});

/**
 * LCM should be applied to the results array to 
 * get the puzzle result. More information:
 * https://old.reddit.com/r/adventofcode/comments/18e6vdf/2023_day_8_part_2_an_explanation_for_why_the/
 */