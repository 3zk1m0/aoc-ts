import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string): number[] =>
  rawInput.split('\n').map((x) => parseInt(x))

const part1 = (input: number[]) => {
  for (const x of input) {
    for (const y of input) {
      if (x + y == 2020) {
        return x * y
      }
    }
  }

  return 0
}

const part2 = (input: number[]) => {
  for (const x of input) {
    for (const y of input) {
      for (const z of input) {
        if (x + y + z == 2020) {
          return x * y * z
        }
      }
    }
  }
}

/* Tests */

// test(878724)

/* Results */

export async function main(args: string) {
  // console.log(await readInput(args))
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
