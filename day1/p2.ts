import { readFile } from 'fs/promises';

const run = async () => {
  const file = await readFile("day1/input.txt");
  const nums = file.toString().split('\n')
    // .filter((l: string) => l.length == 0)
    .map((l: string) => Number(l));
  let count = 0;
  for (let i = 3; i < nums.length; i++) {
    const first = nums[i - 3];
    const second = nums[i - 2];
    const third = nums[i - 1];
    const fourth = nums[i - 0];
    const prevSum = first + second + third;
    const currSum = second + third + fourth;
    if (prevSum < currSum) {
      count++;
    }
  }
  console.log("count is", count);
}

run();
