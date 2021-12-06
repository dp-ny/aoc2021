import { readFile } from 'fs/promises';

const run = async () => {
  const file = await readFile("day2/input.txt");
  const lines = file.toString().split('\n');
  let horizontal = 0;
  let depth = 0;
  let aim = 0;
  for (let line of lines) {
    const [command, distStr] = line.split(' ');
    let dist = Number(distStr);
    if (command === 'forward') {
      horizontal += dist;
      depth += aim * dist;
    } else if (command === 'down') {
      aim += dist;
    } else if (command === 'up') {
      aim -= dist;
    }
  }
  console.log("result is", horizontal, depth, horizontal * depth);
}

run();
