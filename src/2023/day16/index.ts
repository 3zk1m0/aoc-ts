import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => line.split(''))

type Beam = [number, number, number]

const DIR = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

const mirror1: Record<number, number> = {
  0: 3,
  1: 2,
  2: 1,
  3: 0,
}

const mirror2: Record<number, number> = {
  0: 1,
  1: 0,
  2: 3,
  3: 2,
}

const getNewBeams = (beam: Beam, input: Input): Beam[] => {
  const beamDir = DIR[beam[2]]
  const beamX = beam[0] + beamDir[0]
  const beamY = beam[1] + beamDir[1]

  const beamCell = input?.[beamY]?.[beamX]
  if (!beamCell) return []

  switch (beamCell) {
    case '.':
      return [[beamX, beamY, beam[2]]]
    case '/':
      return [[beamX, beamY, mirror1[beam[2]]]]
    case '\\':
      return [[beamX, beamY, mirror2[beam[2]]]]
    case '-':
      if (beam[2] === 0 || beam[2] === 2) {
        return [
          [beamX, beamY, 1],
          [beamX, beamY, 3],
        ]
      } else {
        return [[beamX, beamY, beam[2]]]
      }
    case '|':
      if (beam[2] === 1 || beam[2] === 3) {
        return [
          [beamX, beamY, 0],
          [beamX, beamY, 2],
        ]
      } else {
        return [[beamX, beamY, beam[2]]]
      }
  }
  return []
}

const part1 = (input: Input, start: Beam[] = [[-1, 0, 1]]) => {
  let beams = structuredClone(start)
  let visited = new Set<string>()
  let posSeen = new Set<string>()

  while (beams.length > 0) {
    let newBeams: Beam[] = []
    for (let beam of beams) {
      if (posSeen.has(beam.join(','))) continue
      posSeen.add(beam.join(','))
      visited.add(`${beam[0]},${beam[1]}`)
      getNewBeams(beam, input).forEach((newBeam) => newBeams.push(newBeam))
    }
    beams = newBeams
  }

  // Remove initial position
  return visited.size - 1
}

const part2 = (input: Input) => {
  let max = 0

  for (let y = 0; y < input.length; y++) {
    const value1 = part1(input, [[-1, y, 1]])
    const value2 = part1(input, [[input[y].length, y, 3]])
    max = Math.max(max, value1, value2)
  }

  for (let x = 0; x < input[0].length; x++) {
    const value1 = part1(input, [[x, -1, 0]])
    const value2 = part1(input, [[x, input.length, 2]])
    max = Math.max(max, value1, value2)
  }

  return max
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
