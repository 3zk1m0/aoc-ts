import { manhattanDistance } from '../../math'
import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => line.split(''))

const calculateDistancesWithAge = (input: Input, age: number) => {
  const galaxies: [number, number][] = []
  for (let y = 0; y < input.length; y++) {
    const line = input[y]
    for (let x = 0; x < line.length; x++) {
      const cell = line[x]
      if (cell === '#') {
        galaxies.push([x, y])
      }
    }
  }

  for (let y = input.length - 1; y >= 0; y--) {
    if (input[y].some((cell) => cell !== '.')) continue
    galaxies.forEach((galaxy) => {
      if (galaxy[1] > y) {
        galaxy[1] += age - 1
      }
    })
  }

  for (let x = input[0].length - 1; x >= 0; x--) {
    const column = input.map((line) => line[x])
    if (column.some((cell) => cell !== '.')) continue
    galaxies.forEach((galaxy) => {
      if (galaxy[0] > x) {
        galaxy[0] += age - 1
      }
    })
  }

  let result = 0
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      result += manhattanDistance(galaxies[i], galaxies[j])
    }
  }

  return result
}

const part1 = (input: Input) => {
  return calculateDistancesWithAge(input, 2)
}
const part2 = (input: Input) => {
  return calculateDistancesWithAge(input, 1000000)
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
