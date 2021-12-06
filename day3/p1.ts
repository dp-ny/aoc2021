import { readFile } from 'fs/promises';

const run = async () => {
  const file = await readFile("day3/input.txt");
  const lines = file.toString().split('\n');
  const bits = lines[0].length;
  const bitCounts = new Array(bits).fill(0);
  for (let line of lines) {
    for (let i = 0; i < bits; i++) {
      if (line.charAt(i) == '1') {
        bitCounts[i] = bitCounts[i] + 1;
      }
    }
  }

  const gammaBinary = bitCounts.map(c => c >= lines.length / 2 ? "1" : "0").join('');
  const epsilonBinary = bitCounts.map(c => c < lines.length / 2 ? "1" : "0").join('');

  const gamma = Number(`0b${gammaBinary}`);
  const epsilon = Number(`0b${epsilonBinary}`);
  console.log('result is', gamma*epsilon)
}

run();
