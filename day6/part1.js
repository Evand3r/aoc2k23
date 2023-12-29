import { dayWrapper, getNumbers, useData } from "../common.js";

const testData = `Time:      7  15   30
Distance:  9  40  200
`;

const { data } = useData(testData);

dayWrapper(() => {
    const [raceTimes, recordDistances] = data.split('\n')
        .filter(l => !!l).map(getNumbers);

    return raceTimes.reduce((waysToWin, raceTime, index) => {
        let start, end;

        for (let i = 1; i <= raceTime; i++) {
            if (i * (raceTime - i) > recordDistances[index]) {
                start = i;
                end = raceTime - i;
                break;
            };
        }

        return waysToWin * (end - start + 1);
    }, 1)
})