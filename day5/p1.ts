import { readFile } from 'fs/promises';

const run = async () => {
  const file = await readFile("day5/input.txt");
  const fileLines = file.toString().split('\n');
  interface Point {
    x: number; y: number;
  }
  interface Line {
    p1: Point; p2: Point;
  }
  const lines: Line[] = fileLines.filter(l => !!l).map(l => {
    const [p1, p2] = l.split(' -> ');
    const [x1, y1] = p1.split(',');
    const [x2, y2] = p2.split(',');
    return {
      p1: { x: Number(x1), y: Number(y1) },
      p2: { x: Number(x2), y: Number(y2) },
    }
  });

  const p2k = (p: Point) => JSON.stringify(p);
  const isVertical = (l: Line) => l.p1.x == l.p2.x;
  const isHorizontal = (l: Line) => l.p1.y == l.p2.y;
  const pointHits: Map<string, number> = new Map();
  console.log("starting fe");
  const filterVertical = (l: Line) => isVertical(l) || isHorizontal(l)
  lines.filter(
    l => true
  ).forEach((l, i) => {

    const dir = (start: number, end: number) => start > end ? -1 : 1;
    let length: number, xMul: number, yMul: number;
    if (isVertical(l)) {
       length = Math.abs(l.p1.y - l.p2.y);
       xMul = 0;
       yMul = dir(l.p1.y, l.p2.y);
    } else if (isHorizontal(l)) {
        length = Math.abs(l.p1.x - l.p2.x);
         xMul = dir(l.p1.x, l.p2.x);
         yMul = 0;
    } else {
       length = Math.abs(l.p1.x - l.p2.x);
       xMul = dir(l.p1.x, l.p2.x);
       yMul = dir(l.p1.y, l.p2.y);

    }
    for (let i = 0; i <= length; i++) {
      const x = l.p1.x + xMul * i;
      const y = l.p1.y + yMul * i;
        console.log(`${l.p1.x},${l.p1.y} - ${x}, ${y} - ${l.p2.x},${l.p2.y}`);

        const key = p2k({ x, y });
        if (!pointHits.has(key)) {
          pointHits.set(key, 0);
        }
        pointHits.set(key, pointHits.get(key)! + 1);
      }
    })
  console.log('done');

  const bigHits = [...pointHits.entries()].map(([_, v]) => v).filter(v => v > 1).map(v => 1);
  console.log("num big", bigHits.reduce((a, c) => a + c, 0));
  console.log("fileLines", fileLines.length);
}

run();
