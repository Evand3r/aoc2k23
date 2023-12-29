import { dayWrapper, useData } from "../common.js";

const testData = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const { data } = useData(testData);

dayWrapper(() => {
    let current = '';
    let count = 0;

    const directions = data.split('\n\n')[0].split('');
    const dict = data.split('\n\n')[1].split('\n').filter(l => !!l).reduce((acc, line) => {
        const [label, L, R] = Array.from(line.matchAll(/(\w+)/g), m => m[0]);
        return acc.set(label, { L, R });
    }, new Map())

    while (current !== 'ZZZ') {
        const options = dict.get(count === 0 ? 'AAA' : current);
        const localCount = count >= directions.length ? count % directions.length : count;
        const direction = directions[localCount];

        current = options[direction];
        count++;
    }

    return count;
})