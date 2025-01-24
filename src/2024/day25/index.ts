import { transpose2d } from '../../math'
import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput
  .trim()
  .split('\n\n')
  .map((line) => line.split('\n'))

const format = (input: string[]) => {
  return transpose2d(input.map(pin => pin.split('')))
    .map(pin => pin.filter(x => x === "#").length - 1)
}

const day = (input: Input) => {
  const keys = input.filter(x => x.at(0) === "#####").map(format)
  const locks = input.filter(x => x.at(-1) === "#####").map(format)

  let result = 0
  for (let key of keys) {
    for (let lock of locks) {
      const fit = key.every((_, i) => key[i] + lock[i] <= 5)
      if (fit) result++
    }
  }
  return result
}


export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => day(input))
}
