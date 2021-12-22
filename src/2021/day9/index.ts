import { test, readInput, runPart } from '../../utils'

type Grid = number[][]

const prepareInput = (rawInput: string):Grid => rawInput.split('\n').map(x => x.split('').map(y => parseInt(y, 10)))

const DIR = [
  [0,1], [0,-1], [1,0], [-1,0],
]

const checkIfLowPoint = (grid:Grid, x:number, y:number) => {
  for (let dir of DIR) {
    if (typeof grid?.[y+dir[1]]?.[x+dir[0]] === 'undefined') continue
    if (grid[y][x] >= grid[y+dir[1]][x+dir[0]]) {
      return false
    }
  }
  return true
}

const part1 = (input:Grid) => {
  let result = 0
  for (let y in input) {
    for (let x in input[y]) {
      if (checkIfLowPoint(input, +x, +y)) {
        result += input[y][x]+1
      }
    }
  }
  return result
}

const getBasinSize = (gridOriginal:Grid, x:number, y:number) => {

  const flown = new Set<string>() // x,y
  const todo = [[x,y]]

  while (todo.length > 0) {
    const current = todo.shift()
    for (let dir of DIR) {
      const x = current[0]+dir[0]
      const y = current[1]+dir[1]
      if (typeof gridOriginal?.[y]?.[x] === "undefined") continue
      if (flown.has([x,y].toString())) continue
      if (gridOriginal[y][x] === 9) continue
      todo.push([x,y])
    }
    flown.add(current.toString())
  }

  return flown.size
}

const part2 = (input) => {
  let lowPoints = []
  for (let y in input) {
    for (let x in input) {
      if (checkIfLowPoint(input, +x, +y)) {
        lowPoints.push([+x,+y])
      }
    }
  }

  const scores = lowPoints.map(x => getBasinSize(input, x[0], x[1]))
  return scores.sort((a,b) => b - a).slice(0,3).reduce((r,x) => r * x, 1)
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  // runPart("Part One:", () => part1(input))
  // runPart("Part Two:", () => part2(input))
  test(part1(input),514)
  test(part2(input),1103130)
}

 