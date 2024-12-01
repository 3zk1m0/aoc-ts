import { test, readInput, runPart, Args } from '../../utils'
import { polygonArea } from '../../math'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => {
    const [_, dir, len, color] = line.match(/(\w) (\d+) \(#(\w+)\)/)!
    return { dir, len: parseInt(len), color }
  })

const DIR: Record<string, [number, number]> = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0],
}

const part1 = (input: Input) => {
  const lines: [number, number][] = [[0, 0]]
  let [x, y] = [0, 0]
  let line_len = 0
  for (const { dir, len } of input) {
    const [dx, dy] = DIR[dir]
    x += dx * len
    y += dy * len
    lines.push([x, y])
    line_len += len
  }
  return polygonArea(lines) + Math.floor(line_len / 2 + 1)
}

const part2 = (input: Input) => {
  const lines: [number, number][] = [[0, 0]]
  let [x, y] = [0, 0]
  let line_len = 0
  for (const { color } of input) {
    const len = parseInt(color.substring(0, 5), 16)
    const dir = 'RDLU'[parseInt(color[5])]
    const [dx, dy] = DIR[dir]
    x += dx * len
    y += dy * len
    lines.push([x, y])
    line_len += len
  }
  return polygonArea(lines) + Math.floor(line_len / 2 + 1)
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
