import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => {
  const section = rawInput.trim().split("\n\n")
  const rules = section[0].split("\n").map(x => x.split("|").map(Number))
  const updates = section[1].split("\n").map(x => x.split(",").map(Number))
  return {
    rules: rules,
    updates: updates
  }
}

const checkRule = (update: number[], rules: number[][]) => {
  return update.every((x, i) => {
    const before = update.slice(0, i)
    return rules
      .filter(y => y[0] === x)
      .every(rule => !before.includes(rule[1]))
  })
}

const sumCenter = (update: number[]) => update[Math.floor(update.length / 2)]


const part1 = (input: Input) => {
  return input.updates
    .filter(update => checkRule(update, input.rules))
    .reduce((acc, update) => acc + sumCenter(update), 0)
}

const part2 = (input: Input) => {
  return input.updates
    .filter(update => !checkRule(update, input.rules))
    .map(update => {
      return update.sort((a, b) => {
        const rules = input.rules.filter(rule => rule[0] === a)
        if (rules.length === 0) return 0
        const isInvalid = rules.some(x => x[1] === b)
        return isInvalid ? -1 : 1
      })
    })
    .reduce((acc, update) => acc + sumCenter(update), 0)
}

/* Tests */

const testInput = prepareInput(`\
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`)

test(part1(testInput), 143)
test(part2(testInput), 123)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
