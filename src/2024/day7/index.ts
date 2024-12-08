import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => {
  const rows = rawInput.trim().split('\n')
  return rows.map(row => {
    const [result, rest] = row.split(': ')
    return {
      result: Number(result),
      values: rest.split(' ').map(Number)
    }
  })
}

const day = (input: Input, part2 = false) => {
  return input.filter(({ result, values }, i) => {
    const spaces = values.length - 1
    let backlog = [values]
    for (let i = 0; i < spaces; i++) {
      backlog = backlog.flatMap(numbers => {
        if (numbers[0] > result) return []
        const rest = numbers.slice(2)
        return [
          [numbers[0] + numbers[1], ...rest],
          [numbers[0] * numbers[1], ...rest],
          ...(part2 ? [[Number(numbers.slice(0, 2).join('')), ...rest]] : [])
        ]
      })
    }
    return backlog.some(value => value[0] === result)
  }).reduce((acc, { result }) => acc + result, 0)
}

/* Tests */

const testInput = prepareInput(`\
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`)

test(day(testInput), 3749)
test(day(testInput, true), 11387)

// test()

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => day(input))
  runPart('Part Two:', () => day(input, true))
}
