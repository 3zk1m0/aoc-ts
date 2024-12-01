import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>


const prepareInput = (rawInput: string) => {
  const raw = rawInput.trim().split('\n').map(x => x.split('   ').map(Number))
  return [
    raw.map(x => x[0]),
    raw.map(x => x[1])
  ] as [number[], number[]]
}

const part1 = (input: Input) => {
  const first = input[0].toSorted()
  const second = input[1].toSorted()
  return first
    .map((x, i) => [x, second[i]])
    .reduce((acc, curr) => acc + Math.abs(curr[0] - curr[1]), 0)
}

const part2 = (input: Input) => {
  const counts = input[1].reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1
    return acc
  }, {} as Record<number, number>)
  return input[0].reduce((acc, curr, i) => acc + curr * (counts[curr] ?? 0), 0)
}

/* Tests */

const testInput = prepareInput(`\
3   4
4   3
2   5
1   3
3   9
3   3
`)

test(part1(testInput), 11)
test(part2(testInput), 31)

/* Results */

export const main = async (args: Args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
