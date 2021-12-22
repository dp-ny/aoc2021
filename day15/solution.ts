import { readFile } from 'fs/promises';
import Heap from "heap";

const getAdjacentCellsForGrid = (grid: number[][]) => (i: number, j: number) : number[][] => {
  return [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]]
    .filter(([i, j]) => i >= 0 && j >= 0 && i < grid.length && j < grid[0].length);
}

const dijkstras = (risks: number[][]) => {
  const key = JSON.stringify;
  const visited = new Set();
  const distances: number[][] = new Array(risks.length * 5).fill(
    undefined
  ).map(_ => new Array(risks[0].length * 5).fill(Number.MAX_SAFE_INTEGER));
  const dest = [distances[0].length - 1, distances.length - 1];
  distances[0][0] = 0;
  const allPairs = new Array(risks.length * 5).fill(0)
    .flatMap((_, y) => new Array(risks[0].length * 5).fill(0)
      .map((_, x) => [x, y]));

  const getRisk = (x: number, y: number) => {
    const modX = x % risks[0].length;
    const divX = Math.floor(x / risks[0].length);
    const modY = y % risks.length;
    const divY = Math.floor(y / risks.length);
    const baseRisk = risks[modX][modY];
    let risk = baseRisk + ((divX + divY) % 10);
    return risk > 9 ? risk - 9 : risk;
  }

  const unvisitedSet: Set<String> = new Set();
  const heap: Heap<number[]> = new Heap((a: number[], b: number[]) => {
    return distances[a[0]][a[1]] - distances[b[0]][b[1]];
  });
  let count = 0;
  let total = risks.length * risks[0].length;
  let curr = [0, 0];
  const getAdjacentCells = getAdjacentCellsForGrid(distances);
  while(curr) {
    count++;
    console.log(`count is ${count} / ${total}`);
    console.log(`---${curr}`);
    const [x, y] = curr;
    const adjCells = getAdjacentCells(x, y);
    for (const adj of adjCells) {
      const [ax, ay] = adj;
      if (visited.has(key(adj))) {
        continue;
      }
      const distance = distances[x][y] + getRisk(ax, ay);
      if (distance < distances[ax][ay]) {
        distances[ax][ay] = distance;
        if (!unvisitedSet.has(key(adj))) {
          unvisitedSet.add(key(adj));
          heap.push(adj);
        }
      }
    }
    heap.heapify();

    visited.add(key(curr));
    if (visited.size == 250_000) {
      console.log("none unvisited", distances);
      console.log("dest", dest[0], dest[1]);
      console.log("dest distance", distances[dest[0]][dest[1]]);
      return;
    }
    // console.log("unvisited", unvisited);
    let next: number[] = heap.pop();
    while(visited.has(key(next))) {
      next = heap.pop();
    }
    unvisitedSet.delete(key(next));
    curr = next;
    // console.log("next", curr, distances[curr[0]][curr[1]])
  }
}

const p1 = (file: Buffer) => {
  const lines = file.toString().split('\n').filter(l => l != "");
  const risks: number[][] = lines.map(l => l.split('').map(Number));
  dijkstras(risks);
}

const p2 = (file: Buffer) => {
  const lines = file.toString().split('\n').filter(l => l != "");
  const risks: number[][] = lines.map(l => l.split('').map(Number));
  dijkstras(risks);

}

const run = async () => {
  const file = await readFile("day15/input.txt");
  p1(file);
}

run();
