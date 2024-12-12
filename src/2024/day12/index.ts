import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.trim().split('\n').map((line) => line.split(''))


const DIRS = [
  [0, -1],
  [0, 1],
  [1, 0],
  [-1, 0],
]

const day = (input: Input, part2 = false) => {

  let total = 0;
  const visited = new Set();

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (visited.has(`${x},${y}`)) continue

      let area = 0;
      let edges = new Set();
      let edgeCount = 0;

      const value = input[y][x];

      const stack = [[x, y]];

      while (stack.length > 0) {
        const current = stack.shift()!;
        const key = current.join(",");

        if (visited.has(key)) continue;
        visited.add(key);

        area += 1;

        DIRS
          .map(([dx, dy]) => [current[0] + dx, current[1] + dy])
          .forEach((neighbor, dirIndex) => {
            const neighborValue = input[neighbor[1]]?.[neighbor[0]];
            if (neighborValue === value) {
              stack.push(neighbor);
              return
            }

            edgeCount += 1;
            edges.add(`${dirIndex},${neighbor[0]},${neighbor[1]}`);
            if (!part2) return
            DIRS
              .map(([dx, dy]) => [neighbor[0] + dx, neighbor[1] + dy])
              .filter(([nx, ny]) => edges.has(`${dirIndex},${nx},${ny}`))
              .forEach(() => edgeCount -= 1);

          })
      }

      total += area * edgeCount;
    }
  }

  return total;
}


/* Tests */

const firstExample = prepareInput(`\
AAAA
BBCD
BBCC
EEEC
`)

const secondExample = prepareInput(`\
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`)

test(day(firstExample), 140)
test(day(secondExample), 1930)

test(day(firstExample, true), 80)
test(day(secondExample, true), 1206)

// test()

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => day(input))
  runPart('Part Two:', () => day(input, true))
}
