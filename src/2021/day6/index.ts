import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) =>
  rawInput.split(',').map((x) => parseInt(x, 10))

const part = (input: number[], days) => {
  const groups = input.reduce((r, x) => {
    r[x] += 1
    return r
  }, new Array(9).fill(0))

  for (let day = 0; day < days; day++) {
    groups.push(groups.shift())
    groups[6] += groups[8]
  }

  return groups.reduce((r, x) => r + x, 0)
}

/* Tests */

// test()

/* Results */

const part1 = (input) => part(input, 80)
const part2 = (input) => part(input, 256)

export async function main(args: string) {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
