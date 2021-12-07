import { readFile } from 'fs/promises';

const run = async () => {
  const file = await readFile("day7/input.txt");
  const crabs = file.toString().replace('\n', '').split(',').map(c => Number(c));

  const average = crabs.reduce((a,c) => a+c) / crabs.length;
  const closest = Math.round(average);
  console.log("crabs is", crabs);
  console.log("crabs total", crabs.reduce((a,c) => a+c))
  console.log("average is", average)
  console.log("closest is", closest)

  const min = crabs.reduce((a,c) => a < c ? a : c);
  const max = crabs.reduce((a,c) => a > c ? a : c);
  console.log("min", min, "max", max);

  const fuelCost = (dist: number) => (dist) * (dist + 1) / 2;

  let minFuel = new Array(max - min).fill(0)
    .map((_, i) => i + min)
    .map(d => crabs.map(c => Math.abs(c - d)))
    .map(ds => ds.map(fuelCost))
    .map(fuels => fuels.reduce((a, c) => a + c))
    .reduce((a, c) => a < c ? a : c);

  console.log("minFuel", minFuel);
}

run();
