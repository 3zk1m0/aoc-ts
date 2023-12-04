import { test, readInput, runPart } from '../../utils'

type Input = {
  id: number
  winningNumbers: number[]
  gameNumber: number[]
}[]

const prepareInput = (rawInput: string): Input =>
  rawInput.split('\n').map((line) => {
    const match = RegExp(/Card +(\d+):\s+([\d)\s]+)\|([\d)\s]+)$/).exec(
      line.replace(/\s+/g, ' ')
    )
    return {
      id: Number(match[1]),
      winningNumbers: match[2].trim().split(' ').map(Number),
      gameNumber: match[3].trim().split(' ').map(Number),
    }
  })

const part1 = (input: Input) => {
  return input.reduce((acc, { winningNumbers: winning, gameNumber: data }) => {
    const wins = data.filter((card) => winning.includes(card))
    return wins.length ? acc + 2 ** (wins.length - 1) : acc
  }, 0)
}

const part2 = (input: Input) => {
  const ids = input.map(({ id }) => id)
  const wins = input.reduce(
    (acc, { id, winningNumbers: winning, gameNumber: data }) => {
      acc[id] = data.filter((card) => winning.includes(card)).length
      return acc
    },
    {}
  )

  const totalCards = ids.reduce((acc, id) => {
    acc[id] = 1
    return acc
  }, {})

  Object.keys(wins).forEach((id) => {
    new Array(wins[id])
      .fill(0)
      .map((_, i) => i + Number(id) + 1)
      .forEach((id2) => {
        totalCards[id2] += totalCards[id]
      })
  })

  return Object.values(totalCards).reduce(
    (acc: number, v: number) => acc + v,
    0
  )
}

/* Tests */

const SAMPLE_DATA = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

const sampleInput = prepareInput(SAMPLE_DATA)

test(part1(sampleInput), 13)
test(part2(sampleInput), 30)

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
