import { readFile } from 'fs/promises';

const run = async () => {
  const file = await readFile("day4/input.txt");
  const lines = file.toString().split('\n');
  const balls = lines[0].split(",").map(n => Number(n));

  const boards: number[][][] = []
  for (let i = 2; i < lines.length; i += 6) {
    const board = []
    for (let j = 0; j < 5; j++) {
      const line = lines[i + j];
      const lineArr: number[] = line.split(' ').filter(w => w.length != 0).map(n => Number(n));
      board.push(lineArr);
    }
    boards.push(board);
  }

  let drawnBalls = new Set();
  const isWinning = (board: number[][]) => {
    // Check Verticals
    // Check Horizontals
    let winning = false;
    const isDrawn = (n: number) => drawnBalls.has(n);
    for (let i = 0; i < 5; i++) {
      const horizontalWin = board[i].every(isDrawn);
      const verticalWin = new Array(5).fill(0).map((_, j) => j).map(j => board[j][i]).every(isDrawn);
      winning = winning || horizontalWin || verticalWin;
    }

    // Check Diagonals
    const rightDiagonalWin = new Array(5).fill(0).map((_, i) => i).map(i => board[i][i]).every(isDrawn);
    const leftDiagonalWin = new Array(5).fill(0).map((_, i) => i).map(i => board[i][5-i]).every(isDrawn);
    return winning || rightDiagonalWin || leftDiagonalWin;
  }

  const winningBoards = new Set<number>()
  for (const ball of balls) {
    drawnBalls.add(ball);
    for (let i = 0; i < boards.length; i++) {
      const board = boards[i];
      if (winningBoards.has(i)) {
        continue;
      }

      if (isWinning(board)) {
        winningBoards.add(i);
        if (winningBoards.size == boards.length) {
          const result = board.flatMap(a => a)
            .filter(n => !drawnBalls.has(n))
            .reduce((a, c) => a + c, 0);
          console.log("result is", result);
          console.log("winning ball", ball);
          console.log("result", result * ball);

        }
      }
    }
  }


}

run();
