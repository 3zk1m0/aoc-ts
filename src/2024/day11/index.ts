import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.trim().split(' ').map(Number)

const day = (input: Input, iterations: number) => {

  let stoneRecord = input.reduce((acc, curr) => {
    if (!acc[curr]) acc[curr] = 0
    acc[curr]++
    return acc
  }, {} as Record<number, number>)

  for (let i = 0; i < iterations; i++) {
    stoneRecord = Object.entries(stoneRecord).reduce((acc, [key, count]) => {
      const value = Number(key)
      if (value === 0) {
        if (!acc[1]) acc[1] = count
        else acc[1] += count
        return acc
      }
      if (key.length % 2 === 0) {
        const firstHalf = Number(key.slice(0, key.length / 2))
        const secondHalf = Number(key.slice(key.length / 2))
        if (!acc[firstHalf]) acc[firstHalf] = count
        else acc[firstHalf] += count
        if (!acc[secondHalf]) acc[secondHalf] = count
        else acc[secondHalf] += count
        return acc
      }
      const newValue = value * 2024
      if (!acc[newValue]) acc[newValue] = count
      else acc[newValue] += count
      return acc
    }, {} as Record<number, number>)
  }

  return Object.values(stoneRecord).reduce((acc, curr) => acc + curr, 0)
}

/* Tests */

test(day(prepareInput('0 1 10 99 999'), 1), 7)
test(day(prepareInput('125 17'), 25), 55312)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => day(input, 25))
  runPart('Part Two:', () => day(input, 75))
}
