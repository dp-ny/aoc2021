import { readFile } from 'fs/promises';

const run = async () => {
  const file = await readFile("day6/input.txt");
  const input = file.toString().replace('\n', '');
  // const input = "3,4,3,1,2";
  console.log("fish count", input.split(',').length);

  let daysLeftToCount = input.split(',')
    .map(v => Number(v))
    .reduce((a, c) => {
      if (!a.has(c)) {
        a.set(c, 0);
      }
      a.set(c, a.get(c) + 1);
      return a;
    }, new Map());

    const daysToSimulate = 256;
    console.log("Initial State", daysLeftToCount);
    for (let i = 0; i < daysToSimulate; i++) {
      const nextCounts = new Map();
      for (const key of daysLeftToCount.keys()) {
        if (key == 0) {
          nextCounts.set(6, daysLeftToCount.get(key) + (nextCounts.get(6) ?? 0));
          nextCounts.set(8, daysLeftToCount.get(key));
        } else {
          nextCounts.set(key - 1, daysLeftToCount.get(key) + (nextCounts.get(key - 1) ?? 0));
        }
      }
      daysLeftToCount = nextCounts;
      // console.log(`After ${i + 1} days:`, daysLeftToCount);
    }

    console.log("final fish counts", [...daysLeftToCount.values()].reduce((a, c) => a + c));
}

run();
