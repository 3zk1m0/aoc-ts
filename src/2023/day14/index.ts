import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => line.split(''))

const part1 = (input: Input) => {
  let grid = structuredClone(input)
  tiltNorth(grid)
  return countNorth(grid)
}

const countNorth = (input: string[][]) => {
  return input.reduce((acc, row, i) => {
    const rocs = row.filter((c) => c === 'O').length
    return acc + rocs * (input.length - i)
  }, 0)
}

const hashGrid = (grid: Input) => {
  const hash = new Bun.CryptoHasher('sha256')
  hash.update(grid.map((row) => row.join('')).join('\n'))
  return hash.digest('hex')
}

const tiltNorth = (grid: Input) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== 'O') continue
      for (let i = y - 1; i >= 0; i--) {
        if (grid[i][x] !== '.') {
          grid[y][x] = '.'
          grid[i + 1][x] = 'O'
          break
        }
        if (i === 0) {
          grid[y][x] = '.'
          grid[0][x] = 'O'
          break
        }
      }
    }
  }
}

const tiltSouth = (grid: Input) => {
  for (let y = grid.length - 1; y >= 0; y--) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== 'O') continue
      for (let i = y + 1; i < grid.length; i++) {
        if (grid[i][x] !== '.') {
          grid[y][x] = '.'
          grid[i - 1][x] = 'O'
          break
        }

        if (i === grid.length - 1) {
          grid[y][x] = '.'
          grid[grid.length - 1][x] = 'O'
          break
        }
      }
    }
  }
}

const tiltEast = (grid: Input) => {
  for (let x = grid[0].length - 1; x >= 0; x--) {
    for (let y = 0; y < grid.length; y++) {
      if (grid[y][x] !== 'O') continue
      for (let i = x + 1; i < grid[y].length; i++) {
        if (grid[y][i] !== '.') {
          grid[y][x] = '.'
          grid[y][i - 1] = 'O'
          break
        }

        if (i === grid[y].length - 1) {
          grid[y][x] = '.'
          grid[y][grid[y].length - 1] = 'O'
          break
        }
      }
    }
  }
}

const tiltWest = (grid: Input) => {
  for (let x = 0; x < grid[0].length; x++) {
    for (let y = 0; y < grid.length; y++) {
      if (grid[y][x] !== 'O') continue
      for (let i = x - 1; i >= 0; i--) {
        if (grid[y][i] !== '.') {
          grid[y][x] = '.'
          grid[y][i + 1] = 'O'
          break
        }

        if (i === 0) {
          grid[y][x] = '.'
          grid[y][0] = 'O'
          break
        }
      }
    }
  }
}

const runCycle = (grid: Input) => {
  tiltNorth(grid)
  tiltWest(grid)
  tiltSouth(grid)
  tiltEast(grid)
}

const part2 = (input: Input) => {
  let grid = structuredClone(input)

  const seenStorage = new Set()
  const seenStorageMap = new Map()
  for (let i = 0; i < 1000000000; i++) {
    runCycle(grid)

    const hash = hashGrid(grid)
    if (seenStorage.has(hash)) {
      const loopOrigin = seenStorageMap.get(hash)
      const loopLength = i - loopOrigin

      const remaining = 1000000000 - 1 - i
      const remainingMod = remaining % loopLength

      for (let j = 0; j < remainingMod; j++) {
        runCycle(grid)
      }

      return countNorth(grid)
    }
    seenStorage.add(hash)
    seenStorageMap.set(hash, i)
  }

  return countNorth(grid)
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
