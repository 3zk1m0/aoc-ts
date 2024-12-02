import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.trim().split('\n').map(x => x.split(' ').map(Number))


function validateReport(report: number[]) {
  const up = report.slice(1).every((level, i) => {
    const previous = report[i]
    return previous < level && previous > (level - 4)
  })
  const down = report.slice(1).every((level, i) => {
    const previous = report[i]
    return previous > level && previous < (level + 4)
  })
  return up || down
}


const part1 = (input: Input) => {
  return input.filter(validateReport).length
}

const part2 = (input: Input) => {
  return input.filter(row => {
    return row
      .map((_, i) => row.slice(0, i).concat(row.slice(i + 1)))
      .some(validateReport)
  }).length
}

/* Tests */

const testInput = prepareInput(`\
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`)

test(part1(testInput), 2)
test(part2(testInput), 4)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
