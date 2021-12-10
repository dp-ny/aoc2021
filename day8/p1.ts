import { readFile } from 'fs/promises';

const p1 = (file: Buffer) => {
  const lines = file.toString().split("\n").filter(c => c.length != 0);
  const uniqueDisp = new Set([2, 3, 4, 7]);
  const output = lines.flatMap(l => l.split(" | ")[1].split(" "))
    .map(d => d.length)
    .map(d => uniqueDisp.has(d) ? 1 as number : 0)
    .reduce((a, c) => a + c);
  console.log("output", output)
}

const p2 = (file: Buffer) => {
  const lines = file.toString().split("\n").filter(c => c.length != 0);
  enum Parts {
    top,
    topleft,
    topright,
    mid,
    bottomleft,
    bottomright,
    bottom,
  };
  const numToSegs: Map<number, number> = new Map([
    [0, 6],
    [1, 2],
    [2, 5],
    [3, 5],
    [4, 4],
    [5, 5],
    [6, 6],
    [7, 3],
    [8, 7],
    [9, 5],
  ]);

  const numMapping: Map<number, Parts[]> = new Map([...new Map([
    [1, [Parts.topright, Parts.bottomright]],
    [2, [Parts.top, Parts.topright, Parts.mid, Parts.bottomleft, Parts.bottom]],
    [3, [Parts.top, Parts.topright, Parts.mid, Parts.bottomright, Parts.bottom]],
    [4, [Parts.topleft, Parts.topright, Parts.mid, Parts.bottomright]],
    [5, [Parts.top, Parts.topleft, Parts.mid, Parts.bottomright, Parts.bottom]],
    [6, [Parts.top, Parts.topleft, Parts.mid, Parts.bottomleft, Parts.bottomright, Parts.bottom]],
    [7, [Parts.top, Parts.topright, Parts.bottomright]],
    [8, [Parts.top, Parts.topleft, Parts.topright, Parts.mid, Parts.bottomleft, Parts.bottomright, Parts.bottom]],
    [9, [Parts.top, Parts.topleft, Parts.topright, Parts.mid, Parts.bottomright, Parts.bottom]],
    [0, [Parts.top, Parts.topleft, Parts.topright, Parts.bottomleft, Parts.bottomright, Parts.bottom]],
  ]).entries()]);
  type Char = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'
  const allChars: Char[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

  const uniqueDisp = new Set([2, 3, 4, 7]);
  const candidateChars: Map<Parts, Map<Char, number>> = new Map();
  [
    Parts.top,
    Parts.topleft,
    Parts.topright,
    Parts.mid,
    Parts.bottomleft,
    Parts.bottomright,
    Parts.bottom
  ].forEach(p => candidateChars.set(p, new Map()));
  const processLine = (line: string) => {
    const ps = line.split(" | ");
    const chars: Char[][] = ps[0].split(' ').map(id => id.split('') as Char[]);
    const output: string[] = ps[1].split(' ');

    const frequencies = chars.flatMap(c => c).reduce((a, c) => {
      if (!a.has(c)) {
        a.set(c, 0);
      }
      a.set(c, a.get(c) + 1)
      return a;
    }, new Map());

    const frequencyEntries = [...frequencies.entries()];
    // console.log("frrrreeeeqs", frequencyEntries);
    // let mid: Char = frequencyEntries.find(([c, f]) => f == 7)![0];
    let bleft: Char = frequencyEntries.find(([c, f]) => f == 4)![0];
    let tleft: Char = frequencyEntries.find(([c, f]) => f == 6)![0];
    let bright: Char = frequencyEntries.find(([c, f]) => f == 9)![0];

    const one = chars.find(p => p.length == 2)!;
    const tright: Char = one.find(c => c != bright)!;

    const seven = chars.find(p => p.length == 3)!;
    const top: Char = seven.filter(c => !one.includes(c))[0];

    const four = chars.find(p => p.length == 4)!;
    let knownParts = [...four, top, bleft, tright, bright];
    const bottom = allChars.find(c => !knownParts.includes(c))!;

    const eight = chars.find(p => p.length == 7)!;
    knownParts = [top, tleft, tright, bottom, bright, bleft];
    let mid = eight.find(c => !knownParts.includes(c))!;

    // console.log("---------output", output);
    // console.log({
    //   top,
    //   tleft,
    //   tright,
    //   mid,
    //   bleft,
    //   bright,
    //   bottom
    // });
    // console.log("---------")

    const solution = new Map([
      [Parts.top, top],
      [Parts.topleft, tleft],
      [Parts.topright, tright],
      [Parts.mid, mid],
      [Parts.bottomleft, bleft],
      [Parts.bottomright, bright],
      [Parts.bottom, bottom],
    ])

    const numberCodes = new Map([...numMapping.entries()].map(([num, parts]) =>
      [[...parts.map(p => solution.get(p))].sort().join(''), num]
    ));

    // console.log("----", chars.map(c => c.sort()), " => ", output, "-----");
    // console.log("numberCodes", numberCodes);

    const outputNum = output
      .map(v => [...v.split('')].sort().join(''))
      .map(o => numberCodes.has(o) ? numberCodes.get(o) : `\n\nSolution: ${[...solution.entries()].map(([k, v]: any) => [Parts[k], v]).join(' , ')} \n ${chars.map(c => c.sort()).join('\n--')} \n ${[...numberCodes.entries()].join(' , ')} -- ${o}\n\n`)
      .join('');
    console.log("number is", outputNum);
    return Number(outputNum);
  }

  console.log(processLine("acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf"));

  console.log(lines.map(processLine).reduce((a, c) => a + c))
}

const run = async () => {
  const file = await readFile("day8/input.txt");
  p2(file);
}

run();
