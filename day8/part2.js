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
    let current = [];
    let count = [];

    const directions = data.split('\n\n')[0].split('');
    const dict = data.split('\n\n')[1].split('\n').filter(l => !!l).reduce((accMap, line) => {
        const [label, L, R] = Array.from(line.matchAll(/(\w+)/g), m => m[0]);
        if (label.at(-1) === 'A') current.push(label);

        return accMap.set(label, { L, R });
    }, new Map())

    for (let currentLabel of current) {
        let localCount = 0;
        while (currentLabel.at(-1) !== 'Z') {
            const options = dict.get(currentLabel);
            const direction = directions[localCount % directions.length];

            currentLabel = options[direction];
            localCount++;
        }
        count.push(localCount);
    }

    return count;
})