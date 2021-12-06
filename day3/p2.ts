import { readFile } from 'fs/promises';

const run = async () => {
  const file = await readFile("day3/input.txt");
  let ogLines = file.toString().split('\n');
  const bits = ogLines[0].length;

  const getRating = (makeCriteria: (lines: string[], count: number) => boolean) => {
    let lines = [...ogLines];
    for (let i = 0; i < bits; i++) {
      let count = 0;
      for (let line of lines) {
          if (line.charAt(i) == '1') {
            count++;
          }
        }
      const keepOnes = makeCriteria(lines, count);
      lines = lines.filter(line => keepOnes ? line.charAt(i) == '1' : line.charAt(i) == '0');
      if (lines.length == 1) {
        return lines[0];
      }
    }
    console.log("shouldn't get here", lines);
  }

  const o2Rating = getRating((lines, count) => count >= lines.length / 2)
  const co2Rating = getRating((lines, count) => count < lines.length / 2)

  console.log("o2Rating", o2Rating, Number(`0b${o2Rating}`));
  console.log("co2Rating", co2Rating, Number(`0b${co2Rating}`));

  console.log(Number(`0b${o2Rating}`) * Number(`0b${co2Rating}`));
}

run();
