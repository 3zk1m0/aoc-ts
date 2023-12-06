import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((row) => row.split(''))

const part1 = (map: string[][]) => {
  let count = 0
  let changed = true
  const width = map[0].length
  const height = map.length
  while (changed) {
    changed = false
    for (let turn of ['>', 'v']) {
      const newMap = map.map((row) => row.map((cell) => cell))
      map.forEach((row, y) =>
        row.forEach((cell, x) => {
          const dx = turn === '>' ? (x + 1) % width : x
          const dy = turn === 'v' ? (y + 1) % height : y
          if (turn === cell && map[dy][dx] === '.') {
            newMap[y][x] = '.'
            newMap[dy][dx] = turn
            changed = true
          }
        })
      )
      map = newMap
    }
    count++
  }

  return count
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
}
