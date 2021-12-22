import { assert } from 'console'
import { test, readInput, runPart } from '../../utils'


type Grid = number[][]

const prepareInput = (rawInput: string) => rawInput
  .split('\n')
  .map(row => row.split('').map(x => parseInt(x)))

const part1 = (grid:Grid) => {

  const dangerGrid = grid.map(row => row.map( _ => Infinity))
  dangerGrid[0][0] = 0

  let mutated = true
  while (mutated) {
    mutated = false
    for (let y = 0; y < dangerGrid.length; y++) {
      for (let x = 0; x < dangerGrid.slice(-1)[0].length; x++) {
          if (y == 0 && x == 0) {
            continue
          }

          const minimum = Math.min(
            y > 0 ? dangerGrid[y-1][x] : Infinity,
            x > 0 ? dangerGrid[y][x-1] : Infinity,
            y < dangerGrid.length - 1 ? dangerGrid[y+1][x] : Infinity,
            x < dangerGrid.slice(-1)[0].length - 1 ? dangerGrid[y][x+1] : Infinity,
          )

          if (minimum + grid[y][x] < dangerGrid[y][x]) {
            dangerGrid[y][x] = minimum + grid[y][x]
            mutated = true
          }
      }
    }
  }

  return dangerGrid.slice(-1)[0].slice(-1)[0]
}


const part2 = (input:Grid) => {
 
  const grid = []
  for (let k1 = 0; k1 < 5; k1++) {
    for (let row of input) {
      const newRow = []
      for (let k2 = 0; k2 < 5; k2++) {
        for (let value of row) {
          let val = value + k1 + k2
          newRow.push(val-Math.floor((val-1) / 9) * 9)
        }
      }
      grid.push(newRow)
    }
  }

  return part1(grid)
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}

