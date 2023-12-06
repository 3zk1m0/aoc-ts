import { test, readInput, runPart } from '../../utils'

interface Race {
  time: number
  distance: number
}

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string): Race[] => {
  const lines = rawInput.split('\n')
  const times = [...lines[0].matchAll(/(\d+)/g)].map((m) => Number(m[0]))
  const distances = [...lines[1].matchAll(/(\d+)/g)].map((m) => Number(m[0]))
  return times.map((time, i) => ({
    time,
    distance: distances[i],
  }))
}

const calculateRace = (race: Race) => {
  let count = 0
  for (let pressTime = 0; pressTime < race.time; pressTime++) {
    const result = pressTime * (race.time - pressTime)
    if (result > race.distance) count++
  }
  return count
}

const part1 = (input: Input) => {
  return input.map(calculateRace).reduce((acc, cur) => acc * cur, 1)
}

const part2 = (input: Input) => {
  const races: Race[] = [
    {
      time: Number(input.map((r) => r.time).join('')),
      distance: Number(input.map((r) => r.distance).join('')),
    },
  ]
  return races.map(calculateRace).reduce((acc, cur) => acc * cur, 1)
}

/* Tests */

const SAMPLE_DATA = `Time:      7  15   30
Distance:  9  40  200`

const sampleInput = prepareInput(SAMPLE_DATA)

test(part1(sampleInput), 288)
test(part2(sampleInput), 71503)

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
