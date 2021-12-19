import { readFile } from 'fs/promises';

class Multimap<K, V> {
  constructor(private map: Map<K, V[]> = new Map()) {}

  add(key: K, val: V) {
    if (!this.map.has(key)) {
      this.map.set(key, []);
    }

    this.map.get(key)!.push(val);
  }

  get(key: K) {
    return this.map.get(key);
  }
}

class SmallCave {
  cave: string;
  visitCount: number;
  constructor(cave: string, visitCount: number = 0) {
    this.cave = cave;
    this.visitCount = visitCount;
  }

  visit(cave: string) {
    this.cave === cave && this.visitCount++;
  }

  canVisit(cave: string) {
    return this.cave === cave && this.visitCount < 2;
  }

  clone(): SmallCave {
    return new SmallCave(this.cave, this.visitCount);
  }
}

const isSmallCave = (v: string) => v.toLowerCase() === v;

const p1 = (file: Buffer) => {
  const lines = file.toString().split('\n').filter(l => l.length > 0);

  const map = new Multimap<string, string>();
  const smallCaves: Set<string> = new Set();
  for (const line of lines) {
    const parts = line.split('-');
    const start = parts[0];
    const end = parts[1];
    map.add(start, end);
    map.add(end, start);
    if (isSmallCave(start)) {
      smallCaves.add(start);
    }
    if (isSmallCave(end)) {
      smallCaves.add(end);
    }
  }
  smallCaves.delete("start");
  smallCaves.delete("end");

  const paths = calculatePaths(map, "start", new SmallCave("null"), new Set(), []);
  for (const vertex of smallCaves) {
    paths.push(...calculatePaths(map, "start", new SmallCave(vertex), new Set(), []));
  }

  // while (queue.length > 0) {
  //   const curr = queue.shift();
  //   const connected = map.get(curr);
  // }
  console.log("got paths", new Set(paths), new Set(paths.map(p => p.toString())).size);
}

const calculatePaths =
(map: Multimap<string, string>, curr: string, smallCave: SmallCave, visited: Set<string>, path: string[]): string[][] => {
  path.push(curr);
  if (curr === "end") {
    return [path];
  }
  if (isSmallCave(curr)) {
    visited.add(curr);
  }
  const paths = [];
  for (const vertex of map.get(curr) || []) {
    if (isSmallCave(vertex) && visited.has(vertex) && !smallCave.canVisit(vertex)) {
      continue;
    }
    const newSmallCave = smallCave.clone();
    newSmallCave.visit(vertex);

    paths.push(...calculatePaths(map, vertex, newSmallCave, new Set([...visited]), [...path]))
  }

  return paths;
}

const p2 = (file: Buffer) => {
  const lines = file.toString().split('\n').filter(l => l.length > 0);
}

const run = async () => {
  const file = await readFile("day12/input.txt");
  p1(file);
}

run();
