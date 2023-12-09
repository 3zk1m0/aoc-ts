import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => line.split(' ').map(Number))

const simulate = (line: number[]) => {
  const result = [line]
  while (result.at(-1)!.some((x) => x !== 0)) {
    const last = result.at(-1)!
    const nextRow = last.slice(0, -1).map((_, i) => last[i + 1] - last[i])
    result.push(nextRow)
  }
  return result
}

const part1 = (input: Input) => {
  return input.reduce((acc, line) => {
    const solved = simulate(line)
      .toReversed()
      .reduce((acc, curr) => acc + curr[curr.length - 1], 0)
    return acc + solved
  }, 0)
}

const part2 = (input: Input) => {
  return input.reduce((acc, line) => {
    const solved = simulate(line)
      .toReversed()
      .reduce((acc, curr) => curr[0] - acc, 0)
    return acc + solved
  }, 0)
}

/* Tests */

const SAMPLE_DATA = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`

const sampleInput = prepareInput(SAMPLE_DATA)

test(part1(sampleInput), 114)
test(part2(sampleInput), 2)

/* Results */

export const main = async (args: Args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
