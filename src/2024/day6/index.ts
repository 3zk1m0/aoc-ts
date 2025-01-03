import { test, runPart, runPartAsync } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => {
  const grid = rawInput.trim().split('\n').map(row => row.split(''))
  const guard = [0, 0]
  guard[1] = grid.findIndex(row => row.includes('^'))
  guard[0] = grid[guard[1]].indexOf('^')
  return {
    grid,
    guard
  }
}

const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

const visited = new Set<string>()

const part1 = ({ guard, grid }: Input) => {
  let dir = 0
  const guardPos = guard.slice()

  while (guardPos[0] < grid[0].length && guardPos[1] < grid.length && guardPos[0] >= 0 && guardPos[1] >= 0) {
    visited.add(guardPos.join(','))
    const newPos = [guardPos[0] + DIRS[dir][0], guardPos[1] + DIRS[dir][1]]
    if (newPos[0] < 0 || newPos[1] < 0 || newPos[0] >= grid[0].length || newPos[1] >= grid.length) {
      break
    }
    if (grid[newPos[1]][newPos[0]] === '#') {
      dir = (dir + 1) % 4
      continue
    }
    guardPos[0] += DIRS[dir][0]
    guardPos[1] += DIRS[dir][1]
  }

  return visited.size
}

const WORKER_COUNT = 8 - 1

const part2 = async ({ guard, grid }: Input) => {

  const workers = new Array(WORKER_COUNT).fill(0).map(() => new Worker(import.meta.dir + "/worker.ts"));

  const options = [...visited.entries().map(([key]) => key.split(',').map(Number))].filter(([x, y]) => x !== guard[0] || y !== guard[1])
  const chunkSize = Math.ceil(options.length / WORKER_COUNT)
  const chunks = new Array(WORKER_COUNT).fill(0).map((_, i) => options.slice(i * chunkSize, (i + 1) * chunkSize))

  let results: number[] = []
  for (const [i, worker] of workers.entries()) {
    worker.postMessage({ cmd: "setup", guard, grid })
    worker.onmessage = (event) => {
      if (event.data === 'ready') {
        worker.postMessage(chunks[i])
      } else {
        results.push(event.data)
      }
    }
  }

  let timeout = false
  setTimeout(() => timeout = true, 5000)

  while (results.length < workers.length && !timeout) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  workers.forEach(worker => worker.terminate())

  if (timeout) {
    console.error("Timeout")
    return
  }

  return results.reduce((acc, val) => acc + val, 0)
}

/* Tests */

const testInput = prepareInput(`\
  ....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`)



/* Results */

export const main = async (args: string) => {
  test(part1(testInput), 41)
  test(await part2(testInput), 6)
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  await runPartAsync('Part Two:', () => part2(input))
}
