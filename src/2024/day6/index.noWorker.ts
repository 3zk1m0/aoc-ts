import { test, runPart } from '../../utils'

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

const part2 = ({ guard, grid }: Input) => {
  let result = 0
  const options = [...visited.entries().map(([key]) => key.split(',').map(Number))]
  for (let [x, y] of options) {
    if (x === guard[0] && y === guard[1]) continue

    const guardPos = guard.slice()
    let dir = 0
    const visited = new Set()
    while (guardPos[0] < grid[0].length && guardPos[1] < grid.length && guardPos[0] >= 0 && guardPos[1] >= 0) {
      const key = guardPos.join(',') + ',' + dir
      if (visited.has(key)) {
        result++
        break
      }
      visited.add(key)
      const newPos = [guardPos[0] + DIRS[dir][0], guardPos[1] + DIRS[dir][1]]
      if (newPos[0] < 0 || newPos[1] < 0 || newPos[0] >= grid[0].length || newPos[1] >= grid.length) {
        break
      }
      if (grid[newPos[1]][newPos[0]] === '#' || (newPos[0] === x && newPos[1] === y)) {
        dir = (dir + 1) % 4
        continue
      }
      guardPos[0] += DIRS[dir][0]
      guardPos[1] += DIRS[dir][1]
    }
  }

  return result
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

test(part1(testInput), 41)
test(part2(testInput), 6)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
