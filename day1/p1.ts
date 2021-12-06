import { readFile } from 'fs/promises';

const run = async () => {
  const file = await readFile("day1/input.txt");
  const nums = file.toString().split('\n')
    // .filter((l: string) => l.length == 0)
    .map((l: string) => Number(l));
  let count = 0;
  for (let i = 1; i < nums.length; i++) {
    console.log(nums[i]);
    if (nums[i-1] < nums[i]) {
      count++;
    }
  }
  console.log("count is", count);
}

run();
