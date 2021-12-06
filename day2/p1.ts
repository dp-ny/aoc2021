import { readFile } from 'fs/promises';

const run = async () => {
  const file = await readFile("day2/input.txt");
  const lines = file.toString().split('\n');
  let horizontal = 0;
  let depth = 0;
  for (let line of lines) {
    const [command, distStr] = line.split(' ');
    let dist = Number(distStr);
    if (command === 'forward') {
      horizontal += dist;
    } else if (command === 'down') {
      depth += dist;
    } else if (command === 'up') {
      depth -= dist;
    }
  }
  console.log("result is", horizontal, depth, horizontal * depth);
}

run();
