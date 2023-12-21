import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => line.split(''))

const part1 = (input: Input) => {
  const startY = input.findIndex((l) => l.includes('S'))
  const startX = input[startY].findIndex((c) => c === 'S')

  let grid = structuredClone(input)
  grid[startY][startX] = '.'

  return fillGrid(grid, startX, startY, 65)
}

const DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

const fillGrid = (grid: Input, startX: number, startY: number, steps: number) => {
  let history = new Set<string>()
  history.add(`${startX},${startY}`)
  const parity = [
    new Set<string>(),
    new Set<string>(),
  ]
  for (let i = 1; i < steps; i++) {
    const newHistory = new Set<string>()
    history.forEach((p) => {
      const [x, y] = p.split(',').map(Number)
      DIRECTIONS.forEach(([dx, dy]) => {
        const dxx = x + dx
        const dyy = y + dy
        if (grid?.[dyy]?.[dxx] === '.') {
          if (parity[i % 2].has(`${dxx},${dyy}`)) return
          parity[i % 2].add(`${dxx},${dyy}`)
          newHistory.add(`${dxx},${dyy}`)
        }
      })
    })
    history = newHistory
  }
  return parity[(steps - 1) % 2].size
}


const part2 = (input: Input) => {
  const startY = input.findIndex((l) => l.includes('S'))
  const startX = input[startY].findIndex((c) => c === 'S')

  let grid = structuredClone(input)
  grid[startY][startX] = '.'

  const size = grid.length

  const STEPS = 26501365
  const n = STEPS % size

  let smallEdges = 0
  smallEdges += fillGrid(grid, size - 1, size - 1, n)
  smallEdges += fillGrid(grid, size - 1, 0, n)
  smallEdges += fillGrid(grid, 0, size - 1, n)
  smallEdges += fillGrid(grid, 0, 0, n)

  let largeEdges = 0
  largeEdges += fillGrid(grid, size - 1, size - 1, n + size)
  largeEdges += fillGrid(grid, size - 1, 0, n + size)
  largeEdges += fillGrid(grid, 0, size - 1, n + size)
  largeEdges += fillGrid(grid, 0, 0, n + size)

  let sides = 0
  sides += fillGrid(grid, startX, 0, size)
  sides += fillGrid(grid, startX, size - 1,  size)
  sides += fillGrid(grid, 0, startY, size)
  sides += fillGrid(grid, size - 1, startY, size)

  const count = (STEPS - n) / size
  let res = 0
  res += smallEdges * count
  res += largeEdges * (count - 1)
  res += sides
  res += fillGrid(grid, startX, startY, size - 1) * (count - 1) ** 2
  res += fillGrid(grid, startX, startY, size) * count ** 2

  return res
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
