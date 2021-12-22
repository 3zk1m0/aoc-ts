import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => rawInput
  .split('\n')
  .map(row => row.split('').map(x => parseInt(x, 10)))


const DIR = [
  [-1,-1], [0,-1], [1,-1],
  [-1, 0],         [1, 0],
  [-1, 1], [0, 1], [1, 1],
]

const print = (grid:number[][]) => {
  console.log("===============")
  grid.forEach(row => console.log(row.join('')))
  console.log("===============")
}

const step = (grid:number[][]) => {

  const toFlash = []

  for (let y in grid) {
    for (let x in grid) {
      grid[y][x] += 1
    }
  }

  while ([].concat(...grid).filter(x => x > 9).length) {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] < 10) {
          continue
        }
        if (toFlash.some(pos => pos[0] === x && pos[1] === y )){
          continue
        }

        toFlash.push([x,y])
        grid[y][x] = 0
        for (let dir of DIR) {
          if (!grid?.[y+dir[1]]?.[x+dir[0]]) {
            continue
          }
          grid[y+dir[1]][x+dir[0]] += 1
        }
      }
    }
  }

  return toFlash.length
}

const part1 = (input:number[][]) => {
  let grid = JSON.parse(JSON.stringify(input))

  let flashes = 0
  for (let i = 0; i < 100; i++) {
    flashes += step(grid)
  }
  // print(grid)

  return flashes
}

const part2 = (input) => {
  let grid = JSON.parse(JSON.stringify(input))

  const total = [].concat(...grid).length
  for (let i = 0; i < 2000; i++) {
    if (total === step(grid)) {
      // print(grid)
      return i+1
    }

  }
  return -1
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}

 