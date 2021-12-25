import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => rawInput.split('\n').map(row => row.split(''))

const stepEast = (grid:string[][]) => {

  const newGrid = JSON.parse(JSON.stringify(grid))
    .map(row => row.fill('.'))

  for (let [y, row] of Object.entries(grid)) {
    for (let [x, pos] of Object.entries(row)) {
      if (pos !== '>') {
        if (newGrid[y][x] !== '>') {
          newGrid[y][x] = pos
        }
        continue
      }
      const xD = (+x + 1) % row.length
      if (grid[y][xD] === '.') {
        newGrid[y][xD] = '>'
        continue
      }
      newGrid[y][x] = '>'
    }
  }
  return newGrid
}

const stepSouth = (grid:string[][]) => {

  const newGrid = JSON.parse(JSON.stringify(grid))
    .map(row => row.fill('.'))

  for (let [y, row] of Object.entries(grid)) {
    for (let [x, pos] of Object.entries(row)) {
      if (pos !== 'v') {
        if (newGrid[y][x] !== 'v') {
          newGrid[y][x] = pos
        }
        continue
      }
      const yD = (+y + 1) % grid.length
      if (grid[yD][x] === '.' ) {
        newGrid[yD][x] = 'v'
        continue
      }
      newGrid[y][x] = 'v'
    }
  }
  return newGrid
}

const step = (grid) => {
  let newGrid = stepEast(grid)
  newGrid = stepSouth(newGrid)
  return newGrid
}

const part1 = (input) => {
  let grid = JSON.parse(JSON.stringify(input))
  let newGrid = JSON.parse(JSON.stringify(input))

  let steps = 0
  while (true) {
    steps++
    newGrid = step(grid)
    if (JSON.stringify(newGrid) === JSON.stringify(grid)) {
      break
    }
    grid = newGrid
  }
  
  return steps
}


/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
}

 