import { dayWrapper, useData } from "../common.js";

const testData = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`;
const { data } = useData(testData);

dayWrapper(() => data.split("\n")
  .map(l => l.match(/\d/g))
  .filter(n => Array.isArray(n))
  .reduce((acc, n) => {
    const n1 = n[0];
    const n2 = n.at(-1);

    return acc + +(n1 + n2);
  }, 0)
);
