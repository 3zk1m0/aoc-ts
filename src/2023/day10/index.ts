import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((x) => x.split(''))

const PIPES = {
  '|': [
    [0, -1],
    [0, 1],
  ],
  '-': [
    [-1, 0],
    [1, 0],
  ],
  L: [
    [0, -1],
    [1, 0],
  ],
  J: [
    [0, -1],
    [-1, 0],
  ],
  '7': [
    [0, 1],
    [-1, 0],
  ],
  F: [
    [0, 1],
    [1, 0],
  ],
}

const DIRECTIONS = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
]

let resultPath: [number, number][] = []

const part1 = (input: Input) => {
  const startY = input.findIndex((x) => x.includes('S'))
  const startX = input[startY].findIndex((x) => x === 'S')

  const traversedPaths = DIRECTIONS.map((startDir) => {
    let pos = [startX, startY]
    let time = 0
    const visited = new Map<string, number>()
    visited.set(pos.join(','), time)

    let dir = [...startDir]
    do {
      time++
      const [x, y] = pos
      const [dx, dy] = dir
      const nextPos = [x + dx, y + dy]
      const nextPipe = input?.[nextPos[1]]?.[nextPos[0]]
      if (!nextPipe) return null
      if (nextPipe === 'S') return visited

      const nextDirs = PIPES[nextPipe as keyof typeof PIPES]
      if (!nextDirs) return null

      const fits = nextDirs.some((nextDir) => {
        return x === nextPos[0] + nextDir[0] && y === nextPos[1] + nextDir[1]
      })
      if (!fits) return null

      pos = nextPos
      visited.set(pos.join(','), time)
      dir = nextDirs.find((nextDir) => {
        return x !== nextPos[0] + nextDir[0] || y !== nextPos[1] + nextDir[1]
      })!
    } while (true)
  }).filter((x) => x !== null) as Map<string, number>[]

  const traversedPath = traversedPaths.reduce((acc, cur) => {
    ;[...cur.entries()].forEach(([key, value]) => {
      if (acc.has(key)) {
        acc.set(key, Math.min(acc.get(key)!, value))
      } else {
        acc.set(key, value)
      }
    })
    return acc
  })

  resultPath = [...traversedPath.keys()].map(
    (x) => x.split(',').map(Number) as [number, number]
  )

  return [...traversedPath.values()].reduce((acc, cur) => Math.max(acc, cur), 0)
}

const part2 = (input: Input) => {
  const startY = input.findIndex((x) => x.includes('S'))
  const startX = input[startY].findIndex((x) => x === 'S')

  let newMap: Input = new Array(input.length)
    .fill(0)
    .map(() => new Array(input[0].length).fill('.'))

  resultPath.forEach(([x, y]) => {
    newMap[y][x] = input[y][x]
  })

  newMap[startY][startX] = Object.entries(PIPES).find(([_, dirs]) => {
    return dirs.every(([dx, dy]) => newMap[startY + dy][startX + dx] !== '.')
  })![0]

  return newMap.reduce((acc, row) => {
    let isInside = false
    return (
      acc +
      row.reduce((rowAcc, cell) => {
        if ('|JLS'.includes(cell)) {
          isInside = !isInside
        } else if (cell === '.' && isInside) {
          rowAcc++
        }
        return rowAcc
      }, 0)
    )
  }, 0)
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
