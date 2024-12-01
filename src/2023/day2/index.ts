import { test, readInput, runPart } from '../../utils'

type Color = 'red' | 'green' | 'blue'

type Game = {
  id: number
  marbles: {
    [key in Color]: number
  }[]
}

type Input = Game[]

const prepareInput = (rawInput: string): Input =>
  rawInput.split('\n').map((line) => {
    const gameId = parseInt(line.match(/Game (\d+)/)[1])
    const gameData = line.split(': ')[1]
    const marbles = gameData.split('; ').map((roundData) =>
      roundData.split(', ').reduce(
        (r, x) => {
          const [value, key] = x.split(' ')
          r[key.trim()] = parseInt(value)
          return r
        },
        { red: 0, green: 0, blue: 0 }
      )
    )
    return {
      id: gameId,
      marbles,
    }
  })

const TOTALS = {
  red: 12,
  green: 13,
  blue: 14,
}

const getMaxMarbles = (game: Game) => {
  return game.marbles.reduce(
    (r, x) => {
      Object.keys(x).forEach((key) => {
        r[key] = Math.max(x[key], r[key])
      })
      return r
    },
    { red: 0, green: 0, blue: 0 }
  )
}

const part1 = (input: Input) => {
  const result = input.filter((item) => {
    const sum = getMaxMarbles(item)
    return Object.keys(TOTALS).every((key) => {
      return sum[key] <= TOTALS[key]
    })
  })
  return result.reduce((r, x) => r + x.id, 0)
}

const part2 = (input) => {
  const result = input.map(getMaxMarbles)
  return result.reduce((r, x) => r + x.red * x.green * x.blue, 0)
}

/* Tests */

const SAMPLE = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`

const sampleInput: Input = prepareInput(SAMPLE)

test(getMaxMarbles(sampleInput[0]), { red: 4, green: 2, blue: 6 })
test(getMaxMarbles(sampleInput[1]), { red: 1, green: 3, blue: 4 })
test(getMaxMarbles(sampleInput[2]), { red: 20, green: 13, blue: 6 })
test(getMaxMarbles(sampleInput[3]), { red: 14, green: 3, blue: 15 })
test(getMaxMarbles(sampleInput[4]), { red: 6, green: 3, blue: 2 })

test(part1(sampleInput), 8)
test(part2(sampleInput), 2286)

/* Results */

export async function main(args: string) {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
