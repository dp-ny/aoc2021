
class Point {
  x: number;
  y: number;

  constructor(
    x: number,
    y: number,
  ) {
    this.x = x;
    this.y = y;
    Object.freeze(this);
  }

  plus(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  accelerate() {
    return new Point(
      this.x == 0 ? 0 : (this.x < 0 ? this.x + 1 : this.x - 1),
      this.y - 1,
    )
  }

  key(): string {
    return JSON.stringify({ x: this.x, y: this.y });
  }
}

class TargetArea {
  constructor(
    private xMin: number = 150,
    private xMax: number = 171,
    private yMin: number = -129,
    private yMax: number = -70,
  ) {}

  contains({x, y}: Point) {
    return this.xMin <= x
      && x <= this.xMax
      && this.yMin <= y
      && y <= this.yMax;
  }

  isPast(p: Point) {
    return p.y < this.yMin || p.x > this.xMax;
  }

  points(): Point[] {
    return [
      new Point(this.xMin, this.yMin),
      new Point(this.xMax, this.yMax),
    ]
  }
}

const printPos = (positions: Point[]) => {
  const target = new TargetArea();
  const allPositions = [...positions, ...target.points()]
  const maxX = allPositions.map(p => p.x).reduce((a, c) => a > c ? a : c);
  const minY = allPositions.map(p => p.y).reduce((a, c) => a < c ? a : c);
  const maxY = allPositions.map(p => p.y).reduce((a, c) => a > c ? a : c);
  console.log(minY, "maxY", maxY);
  const key = (p: Point) => p.key();
  const hitPositions = positions.map(key);
  console.log("hitPositions", hitPositions);
  let count = 0;
  const printBoard = () => {
    for (let y = maxY; y >= minY; y--) {
      console.log(new Array(maxX).fill(0).map((_, i) => i)
        .map(x => {
          const point = new Point(x, y);
          const index = hitPositions.indexOf(point.key());
          return hitPositions.includes(point.key())
            ? `${index < 10 ? index : '#'}`
            : (target.contains(point) ? "T" : ".");
        }).join(''));
    }
  }
  const positionMaxX = positions.map(p => p.x).reduce((a, c) => a > c ? a : c);
  const positionMinY = positions.map(p => p.y).reduce((a, c) => a < c ? a : c);
  const positionMaxY = positions.map(p => p.y).reduce((a, c) => a > c ? a : c);
  console.log('maxX', positionMaxX, 'maxY', positionMaxY, 'minY', positionMinY);
  const lastIndex = positions.length - 1;
  console.log(positions[lastIndex - 2]);
  console.log(positions[lastIndex - 1]);
  console.log(positions[lastIndex]);
  console.log(target);
}

const fireProbe = (probeVelocity: Point) => {
  let position: Point = new Point(0, 0);
  const positions = [position];
  const target = new TargetArea();

  while (true) {
    // step
    position = position.plus(probeVelocity);
    positions.push(position);
    probeVelocity = probeVelocity.accelerate();
    if (target.contains(position)) {
      return true;
    }
    if (target.isPast(position)) {
      return false;
    }
  }

}

const p1 = () => {
  let probeVelocity: Point = new Point(17, 128);

  const velocities = [];

  let hit = fireProbe(probeVelocity);
  if (hit) {
    console.log('hit!');
  } else {
    console.log('miss!');
  }
}

const p2 = () => {

  const hits = [];
  for (let x = 0; x < 1000; x++) {
    for (let y = -1000; y < 1000; y++) {
      const probeVelocity: Point = new Point(x, y);
      let hit = fireProbe(probeVelocity);
      if (hit) {
        hits.push(probeVelocity)
      }
    }
  }
  console.log("hits", hits.length);
}


const run = async () => {
  p2();
}

run();
