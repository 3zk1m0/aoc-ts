import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((x) => x.match(/\d+/g).map((x) => parseInt(x, 10)))

type Grid = Map<string, number>

const getGrid = (x, y, grid: Grid) => {
  return grid.get([x, y].toString()) || 0
}

const appedGrid = (x, y, grid: Grid) => {
  const old = grid.get([x, y].toString()) || 0
  grid.set([x, y].toString(), old + 1)
}

const drawLine = (data: number[], grid: Grid) => {
  const [x1, y1, x2, y2] = data

  if (x1 !== x2 && y1 !== y2) {
    return grid // skip diagonal
  }

  let xd = x1 + (x1 < x2 ? -1 : 1)
  let yd = y1 + (y1 < y2 ? -1 : 1)
  while (xd !== x2 || yd !== y2) {
    if (xd !== x2) {
      xd += x1 < x2 ? 1 : -1
    }
    if (yd !== y2) {
      yd += y1 < y2 ? 1 : -1
    }
    appedGrid(xd, yd, grid)
  }
}

const getCorners = (grid: Grid) => {
  let [x1, y1, x2, y2] = [Infinity, Infinity, 0, 0]

  grid.forEach((_, key) => {
    const [x, y] = key.split(',').map((z) => parseInt(z, 10))
    x1 = Math.min(x, x1)
    x2 = Math.max(x, x2)
    y1 = Math.min(y, y1)
    y2 = Math.max(y, y2)
  })

  return [x1, y1, x2, y2]
}

const drawGrid = (grid: Grid) => {
  const [x1, y1, x2, y2] = getCorners(grid)
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      process.stdout.write(getGrid(x, y, grid).toString())
    }
    process.stdout.write('\n')
  }
}

const countOverlaps = (grid: Grid) => {
  let count = 0
  grid.forEach((value) => {
    count += value > 1 ? 1 : 0
  })
  return count
}

const part1 = (input) => {
  let grid = new Map<string, number>()

  input.forEach((row) => {
    drawLine(row, grid)
  })

  // drawGrid(grid)

  return countOverlaps(grid)
}

const drawDiagonalLine = (data: number[], grid: Grid) => {
  const [x1, y1, x2, y2] = data

  if (x1 === x2 || y1 === y2) {
    return grid // skip diagonal
  }

  let xd = x1 + (x1 < x2 ? -1 : 1)
  let yd = y1 + (y1 < y2 ? -1 : 1)
  while (xd !== x2 && yd !== y2) {
    xd += x1 < x2 ? 1 : -1
    yd += y1 < y2 ? 1 : -1
    appedGrid(xd, yd, grid)
  }
}

const part2 = (input) => {
  let grid = new Map<string, number>()

  input.forEach((row) => {
    drawLine(row, grid)
    drawDiagonalLine(row, grid)
  })

  //  drawGrid(grid)

  return countOverlaps(grid)
}

/* Tests */

// test()

/* Results */

export async function main(args: string) {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
