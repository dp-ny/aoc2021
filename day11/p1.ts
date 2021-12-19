import { readFile } from 'fs/promises';

const getAdjacentCellsForGrid = (grid: number[][]) => (i: number, j: number) : number[][] => {
  return [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1],
    [i - 1, j - 1], [i - 1, j + 1], [i + 1, j - 1], [i + 1, j + 1]]
    .filter(([i, j]) => i >= 0 && j >= 0 && i < grid.length && j < grid[0].length);
}
const p1 = (file: Buffer) => {
  const lines = file.toString().split("\n").filter(l => l.length > 0);
//   const lines =
// `5483143223
// 2745854711
// 5264556173
// 6141336146
// 6357385478
// 4167524645
// 2176841721
// 6882881134
// 4846848554
// 5283751526`.split('\n');
  const grid = lines.map(l => l.split('').map(Number));
  const getAdjacentCells = getAdjacentCellsForGrid(grid);

  const step = (count: number) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        grid[i][j]++;
       }
    }

    const flashed: Set<string> = new Set();
    const key = (i: number, j: number) => JSON.stringify({i, j})
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        const curr = grid[i][j];
        const adjCells = getAdjacentCells(i, j);
        if (curr > 9 && !flashed.has(key(i, j))) {
          flashed.add(key(i, j));
          adjCells.forEach(([cellI, cellJ]) => grid[cellI][cellJ]++);
          i = -1;
          j = -1;
          break;
        }
      }
    }

    for (let cell of [...flashed]) {
      let {i, j} = JSON.parse(cell);
      if (grid[i][j] >= 9) {
        grid[i][j] = 0;
      }
    }
    console.log('flashed', flashed.size);
    console.log(`After ${count + 1}:\n`, grid.map(l => l.join('')).join('\n'));
    return flashed.size;
  }

  console.log(`Before any steps:\n`, grid.map(l => l.join('')).join('\n'));
  let count = 0;
  while (true) {
    const flashCount = step(count);
    if (flashCount == grid.length * grid[0].length) {
      break;
    }
    count++;
  }
  console.log("count is", count);
}

const p2 = (file: Buffer) => {
  const lines = file.toString().split('\n').filter(l => l.length > 0);
}

const run = async () => {
  const file = await readFile("day11/input.txt");
  p1(file);
}

run();
