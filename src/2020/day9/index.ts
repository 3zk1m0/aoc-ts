import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((x) => parseInt(x))

const input: number[] = prepareInput(readInput())

const PREAMBLE = 25

const part1 = () => {
  for (let i = PREAMBLE; i < input.length; i++) {
    const preample = input.slice(i - PREAMBLE, i)
    const current = input[i]

    let result = preample.reduce<number[]>((acc, v, i) => {
      const slice = preample.slice(i + 1).map((w) => v + w)
      acc.concat(slice)
      return acc
    }, [])

    if (!result.includes(current)) return current
  }
}

const findRange = (input, invalid): number[] => {
  for (let i = 0; i < input.length; i++) {
    for (let x = i + 2; x <= input.length; x++) {
      const sum = input.slice(i, x).reduce((a, b) => a + b, 0)
      if (sum == invalid) return [i, x]
    }
  }
  return []
}

const part2 = () => {
  const invalid = part1()

  let range = findRange(input, invalid)
  let list = input.slice(...range)

  return Math.min(...list) + Math.max(...list)
}

/* Tests */

// test()

/* Results */

runPart('Part One:', part1)
runPart('Part Two:', part2)
