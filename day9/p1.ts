import { readFile } from 'fs/promises';

const sum = (a: number, c: number) => a + c;
const getAdjacentCells = (grid: number[][]) => (i: number, j: number) : number[][] => {
  return [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]]
    .filter(([i, j]) => i >= 0 && j >= 0 && i < grid.length && j < grid[0].length);
}

const p1 = (file: Buffer) => {
  const lines = file.toString();
  const grid = lines.split('\n').filter(c => c.length > 0).map(l => l.split('').map(Number));

  const lowPoints = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const curr = grid[i][j];
      const isLow = getAdjacentCells(grid)(i, j)
        .map(([ii, jj]) => grid[ii][jj])
        .every(c => c > curr);
      if (isLow) {
        // console.log("found low points", curr);
        lowPoints.push(curr);
      }
    }
  }
  console.log("sum is", lowPoints.map(p => p + 1).reduce(sum))
}

const p2 = (file: Buffer) => {
  const lines = file.toString();
  const grid = lines.split('\n').filter(c => c.length > 0).map(l => l.split('').map(Number));

  const checked = new Set();
  const key = (i: number, j: number) => JSON.stringify({ i, j });
  const inBasin = (i: number, j: number) => checked.has(key(i, j));
  const basins: string[][] = [];

  for (let startI = 0; startI < grid.length; startI++) {
    for (let startJ = 0; startJ < grid[0].length; startJ++) {
      const basin: string[] = [];
      const queue = [[startI, startJ]];
      while (queue.length != 0) {
        const [ii, jj] = queue.shift()!;
        const curr = grid[ii][jj];
        // console.log("Checking", ii, ",", jj, "-", curr);

        if (inBasin(ii, jj) || curr == 9) {
          continue;
        }
        basin.push(key(ii, jj));
        checked.add(key(ii, jj));
        // console.log("adjacent", getAdjacentCells(grid)(ii, jj));
        const adjCells = getAdjacentCells(grid)(ii, jj).filter(([p, q]) => !checked.has(key(p, q)));
        queue.push(...adjCells);
      }
      if (basin.length != 0) {
        basins.push(basin);
      }
    }
  }

  console.log("got basins", basins);
  const sort = (a: number, b: number) => b - a;
  console.log("got basins", basins.map(b => b.length).sort(sort));
  console.log("solution", basins.map(b => b.length).sort(sort).filter((_, i) => i < 3).reduce((a, c) => a * c));

}

const run = async () => {
  const file = await readFile("day9/input.txt");
  p2(file);
}

run();
