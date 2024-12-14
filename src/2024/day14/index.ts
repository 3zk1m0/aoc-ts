import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.trim().split('\n').map((line) => {
  const match = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)
  if (!match) throw new Error('Invalid input')
  return {
    p: { x: Number(match[1]), y: Number(match[2]) },
    v: { x: Number(match[3]), y: Number(match[4]) }
  }
})

const WIDTH = 101
const HEIGHT = 103

const part1 = (input: Input) => {
  const robots = structuredClone(input)
  for (let i = 0; i < 100; i++) {
    for (const robot of robots) {
      robot.p.x += robot.v.x
      robot.p.y += robot.v.y
      if (robot.p.x < 0) robot.p.x = WIDTH + robot.p.x
      if (robot.p.y < 0) robot.p.y = HEIGHT + robot.p.y
      if (robot.p.x >= WIDTH) robot.p.x = robot.p.x - WIDTH
      if (robot.p.y >= HEIGHT) robot.p.y = robot.p.y - HEIGHT
    }
  }

  const centerX = Math.floor(WIDTH / 2)
  const centerY = Math.floor(HEIGHT / 2)

  const quads = robots.reduce((acc, robot) => {
    const quad = robot.p.x < WIDTH / 2 ? (robot.p.y < HEIGHT / 2 ? 0 : 1) : (robot.p.y < HEIGHT / 2 ? 2 : 3)
    if (robot.p.x !== centerX && robot.p.y !== centerY) {
      acc[quad] = (acc[quad] || 0) + 1
    }
    return acc
  }, {} as Record<number, number>)

  return Object.values(quads).reduce((acc, count) => acc * count, 1)
}

const part2 = (input: Input) => {

  const robots = structuredClone(input)
  for (let i = 1; true; i++) {
    for (const robot of robots) {
      robot.p.x += robot.v.x
      robot.p.y += robot.v.y
      if (robot.p.x < 0) robot.p.x = WIDTH + robot.p.x
      if (robot.p.y < 0) robot.p.y = HEIGHT + robot.p.y
      if (robot.p.x >= WIDTH) robot.p.x = robot.p.x - WIDTH
      if (robot.p.y >= HEIGHT) robot.p.y = robot.p.y - HEIGHT
    }

    // For some reason,
    // the solution works with the first iteration where all robots are in unique positions
    const unique = new Set(robots.map((robot) => `${robot.p.x},${robot.p.y}`))
    if (unique.size === robots.length) {
      return i
    }
  }
}

/* Tests */

// test()

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
