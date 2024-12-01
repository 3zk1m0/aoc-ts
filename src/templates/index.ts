import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput

const part1 = (input: Input) => {}

const part2 = (input: Input) => {}

/* Tests */

// test()

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
