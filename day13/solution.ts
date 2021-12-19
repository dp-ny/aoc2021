import { readFile } from 'fs/promises';

interface Point {
  x: number;
  y: number;
}

interface Fold {
  dir: "x" | "y";
  val: number;
}
const p1 = (file: Buffer) => {
  const parts = file.toString().split('\n\n');
  const dotLines = parts[0].split('\n');
  const foldLines = parts[1].split('\n');

  let dots = dotLines.map(l => {
    const parts = l.split(',');
    return {
      x: Number(parts[0]),
      y: Number(parts[1]),
    }
  });

  const folds = foldLines.map(l => l.replace("fold along ", ""))
    .map(l => {
      const parts = l.split('=');
      return {
        dir: parts[0],
        val: Number(parts[1]),
      }
    });

    const dedup = (dots: Point[]) => {
      return [...new Set([...dots.map(d => JSON.stringify(d))])].map(d => JSON.parse(d));
    }

  for (const fold of folds) {
    const flipDir = fold.dir;
    const foldVal = fold.val;
    dots = dots.map(p => {
      const oldVal = flipDir == "x" ? p.x : p.y;
      const flipVal = oldVal < foldVal ? oldVal : foldVal - (oldVal - foldVal);

      return flipDir == "x" ? {
        x: flipVal,
        y: p.y,
      } : {
        x: p.x,
        y: flipVal,
      };
    });
    dots = dedup(dots);
    console.log('dots', dots, dots.length);
    return;
  }
}

const p2 = (file: Buffer) => {
  const parts = file.toString().split('\n\n');
  const dotLines = parts[0].split('\n');
  const foldLines = parts[1].split('\n').filter(l => l != "");

  let dots = dotLines.map(l => {
    const parts = l.split(',');
    return {
      x: Number(parts[0]),
      y: Number(parts[1]),
    }
  });

  const folds = foldLines.map(l => l.replace("fold along ", ""))
    .map(l => {
      const parts = l.split('=');
      return {
        dir: parts[0],
        val: Number(parts[1]),
      }
    });

    const dedup = (dots: Point[]) => {
      return [...new Set([...dots.map(d => JSON.stringify(d))])].map(d => JSON.parse(d));
    }

  for (const fold of folds) {
    console.log("fold", fold);
    const flipDir = fold.dir;
    const foldVal = fold.val;
    dots = dots.map(p => {
      console.log(p);
      const oldVal = flipDir == "x" ? p.x : p.y;
      const flipVal = oldVal < foldVal ? oldVal : foldVal - (oldVal - foldVal);
      console.log(oldVal, foldVal, flipVal);

      return flipDir == "x" ? {
        x: flipVal,
        y: p.y,
      } : {
        x: p.x,
        y: flipVal,
      };
    });
    dots = dedup(dots);
  }

  const p = (x: number, y: number): Point => { return { x, y } };
  const stringDots = new Set([...dots.map(d => JSON.stringify(d))]);
  const maxX = Math.max(...dots.map(p => p.x));
  const maxY = Math.max(...dots.map(p => p.y));
  console.log("maxX", maxX, "maxY", maxY);

  for (let y = 0; y < maxY + 1; y++) {
    const lineDots = new Array(maxX + 1).fill(0).map((_, i) => i)
      .map(x => p(x, y))
      .map(p => JSON.stringify(p))
      .map(p => stringDots.has(p) ? "#" : ".");
    console.log(lineDots.join(' '));
  }
}

const run = async () => {
  const file = await readFile("day13/input.txt");
  p2(file);
}

run();
