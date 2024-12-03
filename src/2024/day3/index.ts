import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.trim()

const part1 = (input: Input) => {
  return [...input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)]
    .reduce((acc, [_, a, b]) => acc + (Number(a) * Number(b)), 0)
}

const part2 = (input: Input) => {
  let disabled = false
  return [...input.matchAll(/(mul\((\d{1,3}),(\d{1,3})\))|(do\(\))|(don't\(\))/g)]
    .reduce((acc, [cmd,_,a,b]) => {
      if (cmd.startsWith('don\'t')) {
        disabled = true
        return acc
      }
      if (cmd.startsWith('do')) {
        disabled = false
        return acc
      }
      if (disabled) return acc
      return acc + (Number(a) * Number(b))
    }, 0)
}


/* Tests */

const TEST_INPUT_1 = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))"
const TEST_INPUT_2 = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"

test(part1(prepareInput(TEST_INPUT_1)), 161)
test(part2(prepareInput(TEST_INPUT_2)), 48)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
