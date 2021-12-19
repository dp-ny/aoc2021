import { readFile } from 'fs/promises';

interface Point {
  x: number;
  y: number;
}

interface Fold {
  dir: "x" | "y";
  val: number;
}

const peek = (c: any) => {
  console.log(c);
  return c;
}

const p1 = (file: Buffer) => {
  const parts = file.toString().split('\n\n');
  const starter = parts[0];
  const instructions = parts[1].split('\n').filter(l => l != "")
    .map(l => l.split(' -> '))
    .reduce((map, c) => {
      map.set(c[0], c[1]);
      return map;
    }, new Map());
  let polymer: string[] = starter.split('')
    .map((_, i) => starter.slice(i, i + 2))
    .filter(l => l.length == 2);
  const ogPairs = polymer.reduce((a: Map<string, number>, c: string) => {
    if (!a.has(c)) {
      a.set(c, 0);
    }
    a.set(c, a.get(c)! + 1);
    return a;
  }, new Map());

  const numSteps = 40;
  console.log("starter", starter);
  let pairs = ogPairs;
  for (let step = 0; step < numSteps; step++) {
    pairs = [...pairs.entries()].flatMap(([pair, count]) => {
      const insert = instructions.get(pair);
      return [
        [pair.charAt(0) + insert, count],
        [insert + pair.charAt(1), count],
      ]
    }).reduce((a: Map<any, number>, curr: any) => {
      const [pair, count] = curr;
      if (!a.has(pair)) {
        a.set(pair, 0);
      }
      a.set(pair, a.get(pair)! + count);
      return a;
    }, new Map())
    console.log("pairs", pairs);
  }

  const charCounts = [...pairs.entries()]
    .reduce((a: Map<any, number>, curr: any) => {
      const [p, count] = curr;
      const char = p.charAt(0);
      if (!a.has(char)) {
        a.set(char, 0);
      }
      a.set(char, a.get(char)! + count);
      return a;
    }, new Map());
  const lastChar = starter.charAt(starter.length - 1);
  charCounts.set(lastChar, charCounts.get(lastChar)! + 1);
  console.log(charCounts);
  let min = Math.min(...charCounts.values());
  let max = Math.max(...charCounts.values());
  for (const [pair, count] of charCounts.entries()) {
    if (count == min) {
      console.log("MIN: ", pair, count);
    }
    if (count == max) {
      console.log("MAX: ", pair, count);
    }

  }

  // const charCounts = polymer.reduce((a: Map<string, number>, c: string) => {
  //   if (!a.has(c)) {
  //     a.set(c, 0);
  //   }
  //   a.set(c, a.get(c)! + 1);
  //   return a;
  // }, new Map());

  // console.log(charCounts);
}

const p2 = (file: Buffer) => {
  const parts = file.toString().split('\n\n');
  const dotLines = parts[0].split('\n');
  const foldLines = parts[1].split('\n').filter(l => l != "");

}

const run = async () => {
  const file = await readFile("day14/input.txt");
  p1(file);
}

run();
