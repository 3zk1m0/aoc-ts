import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((x) => parseInt(x, 10))

const part1 = (input: number[]) => {
  return input.reduce((r, x, i, a) => {
    if (i == 0) return r
    if (a[i - 1] < x) r++
    return r
  }, 0)
}

const part2 = (input: number[]) => {
  return input.reduce((r, x, i, a) => {
    if (i == 0 || i == 1 || i == 2) return r
    const last = a.slice(i - 3, i).reduce((a, b) => a + b, 0)
    const now = a.slice(i - 2, i + 1).reduce((a, b) => a + b, 0)
    if (last < now) r++
    return r
  }, 0)
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
