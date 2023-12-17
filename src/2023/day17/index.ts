import { test, readInput, runPart, Args } from '../../utils'
import { inRange2d } from '../../math'
import Heap from 'heap-js'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((row) => row.split('').map(Number))

const DIRS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

type Crucible = [number, number, number, number]

const runCrucibles = (input: Input, minDist: number, maxDist: number) => {
  const crucibles = new Heap<Crucible>((a, b) => a[0] - b[0])
  crucibles.push([0, 0, 0, -1])

  const seen = new Set<string>()
  const costs = new Map<string, number>()

  while (crucibles.length > 0) {
    const [cost, x, y, dir] = crucibles.pop()!

    if (x === input[0].length - 1 && y === input.length - 1) {
      return cost
    }

    if (seen.has(`${x},${y},${dir}`)) continue
    seen.add(`${x},${y},${dir}`)

    DIRS.forEach(([dx, dy], dirI) => {
      let costIncrease = 0
      if (dirI === dir || (dirI + 2) % 4 === dir) return

      for (let dist = 1; dist < maxDist + 1; dist++) {
        const xx = x + dx * dist
        const yy = y + dy * dist
        if (!inRange2d([xx, yy], input)) continue

        costIncrease += input[yy][xx]
        if (dist < minDist) continue

        const key = `${xx},${yy},${dirI}`
        const newCost = cost + costIncrease
        if ((costs.get(key) ?? Infinity) <= newCost) continue

        costs.set(key, newCost)
        crucibles.push([newCost, xx, yy, dirI])
      }
    })
  }
}

const part1 = (input: Input) => {
  return runCrucibles(input, 1, 3)
}

const part2 = (input: Input) => {
  return runCrucibles(input, 4, 10)
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
