import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.split('\n').map(row => row.split('').map(Number))

const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

type Vector = [number, number]

const trackTrailScore = (grid: number[][], position: Vector) => {
  const [x, y] = position
  const value = grid[y][x]
  if (value === 9) {
    return [[x, y]] as Vector[]
  }

  const scores: Vector[] = []

  for (let dir of DIRS) {
    const [dx, dy] = [x + dir[0], y + dir[1]]
    if (grid?.[dy]?.[dx] !== value + 1) continue
    const newScores = trackTrailScore(grid, [dx, dy])
    if (newScores.length) {
      scores.push(...newScores)
    }
  }

  return scores
}

const part1 = (input: Input) => {
  const trailHeads: Vector[] = []
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === 0) {
        trailHeads.push([x, y])
      }
    }
  }

  return trailHeads
    .map(head => new Set(trackTrailScore(input, head)
    .map(([x, y]) => `${x},${y}`)))
    .reduce((acc, set) => acc + set.size, 0)
}

const trackTrailRating = (grid: number[][], track: Vector[]) => {
  const [x, y] = track.at(-1)!
  const value = grid[y][x]
  if (value === 9) {
    return [track]
  }

  const ratings: Vector[][] = []

  for (let dir of DIRS) {
    const [dx, dy] = [x + dir[0], y + dir[1]]
    if (grid?.[dy]?.[dx] !== value + 1) continue
    const newTrack = [...track, [dx, dy]] as Vector[]
    const newRatings = trackTrailRating(grid, newTrack)
    if (newRatings.length) {
      ratings.push(...newRatings)
    }
  }

  return ratings
}

const part2 = (input: Input) => {
  const trailHeads: Vector[] = []
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === 0) {
        trailHeads.push([x, y])
      }
    }
  }

  const allRoutes = trailHeads
    .flatMap(head => trackTrailRating(input, [[head[0], head[1]]])
    .map(track => track.join('->')))

  return new Set(allRoutes).size
}

/* Tests */

const testInput = prepareInput(`\
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`)

test(part1(testInput), 36)
test(part2(testInput), 81)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
