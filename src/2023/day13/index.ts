import { getDiffCount, transpose2d } from '../../math'
import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) =>
  rawInput
    .split('\n\n')
    .map((line) => line.split('\n').map((row) => row.split('')))

const getReflectionIndex = (grid: string[][], smudge: number) => {
  for (let r = 0; r < grid.length - 1; r++) {
    let diffs = getDiffCount(grid[r], grid[r + 1])
    if (diffs > smudge) continue

    for (let i = 0; i < Math.min(r, grid.length - r); i++) {
      const lowRow = r - i - 1
      const highRow = r + 2 + i

      if (lowRow < 0 || highRow >= grid.length) break

      diffs += getDiffCount(grid[lowRow], grid[highRow])

      if (diffs > smudge) break
    }
    if (diffs === smudge) {
      return r + 1
    }
  }
  return 0
}

const part1 = (input: Input) => {
  return input.reduce((acc, grid, i) => {
    const transposed = transpose2d(grid)
    const vertical = getReflectionIndex(transposed, 0)
    const horizontal = getReflectionIndex(grid, 0)
    return acc + horizontal * 100 + vertical
  }, 0)
}

const part2 = (input: Input) => {
  return input.reduce((acc, grid, i) => {
    const transposed = transpose2d(grid)
    const vertical = getReflectionIndex(transposed, 1)
    const horizontal = getReflectionIndex(grid, 1)
    return acc + horizontal * 100 + vertical
  }, 0)
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
