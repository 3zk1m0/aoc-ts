import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

type Vector = [number, number]

const prepareInput = (rawInput: string) => rawInput
  .trim()
  .split('\n')
  .map((line) => line.split(',').map(Number) as Vector)

const DIRS: Vector[] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];

interface QueueItem {
  x: number,
  y: number,
  distance: number
}

const bfs = (bytes: Vector[], count: number, size: number): number => {

  const corrupted = new Set<string>(
    bytes
      .slice(0, count)
      .map(([x, y]) => `${x},${y}`)
  )

  const queue: QueueItem[] = [{
    x: 0, y: 0, distance: 0
  }];
  const visited = new Set<string>();
  visited.add("0,0");

  while (queue.length > 0) {
    const { x, y, distance } = queue.shift()!;
    if (x === size && y === size) {
      return distance;
    }

    for (const [dx, dy] of DIRS) {
      const nx = x + dx;
      const ny = y + dy;
      const key = `${nx},${ny}`
      if (
        nx >= 0 && nx <= size &&
        ny >= 0 && ny <= size &&
        !visited.has(key) &&
        !corrupted.has(key)
      ) {
        visited.add(key);
        queue.push({ x: nx, y: ny, distance: distance + 1 });
      }
    }
  }

  return -1;
};

const part1 = (input: Input, bytes = 1024, size = 70) => {
  return bfs(input, bytes, size);
};

const part2 = (input: Input, size = 70) => {
  let left = 0;
  let right = input.length
  let result = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (bfs(input, mid, size) !== -1) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return input[result].join(',');
};

/* Tests */

const testInput = prepareInput(`\
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`)

test(part1(testInput, 12, 6), 22)
test(part2(testInput, 6), "6,1")

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
