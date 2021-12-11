import { readFile } from 'fs/promises';

const getAdjacentCells = (grid: number[][]) => (i: number, j: number) : number[][] => {
  return [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]]
    .filter(([i, j]) => i >= 0 && j >= 0 && i < grid.length && j < grid[0].length);
}

const pairs = new Map([
  ['(', ')'],
  ['[', ']'],
  ['<', '>'],
  ['{', '}'],
]);
const starts: Set<string> = new Set([...pairs.keys()]);
const ends: Set<string> = new Set([...pairs.values()]);

const points = new Map([
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137],
]);

const p1 = (file: Buffer) => {
  const lines = file.toString().split("\n");
//   const lines =
// `[({(<(())[]>[[{[]{<()<>>
// [(()[<>])]({[<{<<[]>>(
// {([(<{}[<>[]}>{[]{[(<()>
// (((({<>}<{<{<>}{[]{[]{}
// [[<[([]))<([[{}[[()]]]
// [{[{({}]{}}([{[{{{}}([]
// {<[[]]>}<{[{[{[]{()[[[]
// [<(<(<(<{}))><([]([]()
// <{([([[(<>()){}]>(<<{{
// <{([{{}}[<[[[<>{}]]]>[]]`.split("\n");

  let sum = 0;
  for (let line of lines) {
    const stack = [];
    for (const char of line.split('')) {
      // console.log("checking", char, "starts", starts);
      if (starts.has(char)) {
        stack.unshift(pairs.get(char));
      } else if (stack.length == 0) {
        // INVALID
        console.log("stack unexpectedly empty");
      } else {
        const lastEnd = stack.shift()!;
        if (char != lastEnd) {
          // INVALID
          sum += points.get(char)!;
          // console.log("points are", points);
          // console.log("found invalid", char, "!=", lastEnd, "points", points.get(char));
          break;
        }
      }
    }
    if (stack.length != 0) {
      console.log("incomplete line", line);
      console.log("stack is", stack);
    }
  }

  console.log("sum is", sum);
}

const p2 = (file: Buffer) => {
  const points = new Map([
    [')', 1],
    [']', 2],
    ['}', 3],
    ['>', 4],
  ]);

  const lines = file.toString().split('\n').filter(l => l.length > 0);
//   const lines = ['[({(<(())[]>[[{[]{<()<>>',
//   '[(()[<>])]({[<{<<[]>>(',
// '(((({<>}<{<{<>}{[]{[]{}',
// '{<[[]]>}<{[{[{[]{()[[[]',
// '<{([{{}}[<[[[<>{}]]]>[]]',];
  let scores = [];
  for (let line of lines) {
    const stack = [];
    for (const char of line.split('')) {
      // console.log("checking", char, "starts", starts);
      if (starts.has(char)) {
        stack.unshift(pairs.get(char)!);
      } else if (stack.length == 0) {
        // INVALID
        console.log("stack unexpectedly empty");
        stack.splice(0, stack.length);
        break;
      } else {
        const lastEnd = stack.shift()!;
        if (char != lastEnd) {
          // INVALID
          stack.splice(0, stack.length);
          // console.log("points are", points);
          // console.log("found invalid", char, "!=", lastEnd, "points", points.get(char));
          break;
        }
      }
    }
    if (stack.length != 0) {
      const score = stack.map((c: string) => points.get(c)!)
        .reduce((a: number, c: number) => a * 5 + c, 0);
        scores.push(score);
    };
  }
  console.log("scores", scores.sort((a, b) => a - b));
  console.log("scores", scores.length);
  console.log("middle", Math.floor(scores.length / 2));
  console.log("middle score", scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)])
}

const run = async () => {
  const file = await readFile("day10/input.txt");
  p2(file);
}

run();
