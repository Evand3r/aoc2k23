import { readFileSync } from 'fs';
import { argv } from 'process';

const inputFileName = argv[1].split('/').with(-1, "input").join('/');
const isTesting = argv[2] === '-test';

let data = isTesting ? null : readFileSync(inputFileName, 'utf-8');

export function useData(testData = null) {
  return { data: data ?? testData };
}

//TODO: do the testing
export function dayWrapper(fn) {
  if (typeof fn !== 'function') throw Error("Not a function");

  console.time("Processing...")
  const result = fn();
  console.log(`Result ${isTesting ? "[testing]:" : ":"}`, result);
  console.timeEnd("Processing...")
}