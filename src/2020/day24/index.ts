import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => rawInput.split('\n').map(x => {
  return x.match(/e|se|sw|w|nw|ne/g)!
})

const input:string[][] = prepareInput(readInput())

const getCord = (dir:string[]) => {
  return dir.reduce((cord, x) => {
    switch (x) {
      case "e":
        return [cord[0]+1,cord[1]]
      case "se":
        return [cord[0]+1,cord[1]-1]
      case "sw":
        return [cord[0],cord[1]-1]
      case "w":
        return [cord[0]-1,cord[1]]
      case "nw":
        return [cord[0]-1,cord[1]+1]
      case "ne":
        return [cord[0],cord[1]+1]
    
      default:
        console.log("Regex fuckup")
        return cord
    }
  },[0,0])
}

let grid = new Map()

const part1 = () => {
  input.forEach(row => {
    const cord = getCord(row).toString()
    const state = grid.get(cord) || false
    grid.set(cord, !state)
  });

  return [...grid.values()].filter(x=>x).length
}

const DIRECTIONS = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]]

const getNextState = (cord:number[]):boolean => {
    const count = DIRECTIONS.reduce((count, curr) => {
      const val = grid.get([cord[0]+curr[0],cord[1]+curr[1]].toString()) || false
      return count + (val ? 1 : 0)
    },0)
    const val = grid.get(cord.toString()) || false
    if (!val && count == 2) return true
    else if (val && (count == 0 || count > 2)) return false
    else return val
}

const simulateDay = () => {
  const newGrid = new Map()
  grid.forEach((_, key) => {
    const curr = key.split(",").map(x => parseInt(x))
    const newVal = getNextState(curr)
    newGrid.set(key,newVal)
    DIRECTIONS.forEach(cord => {
      const newCord = [cord[0]+curr[0],cord[1]+curr[1]]
      if (grid.has(newCord.toString())) return
      if (newGrid.has(newCord.toString())) return
      if (getNextState(newCord))
        newGrid.set(newCord.toString(),true)
    })
  })
  return newGrid
}

const part2 = () => {
  for (let i = 0; i < 100; i++) {
    grid = simulateDay()
  }
  return [...grid.values()].filter(x=>x).length
}

/* Tests */

// test()

/* Results */

runPart("Part One:", part1)
runPart("Part Two:", part2)

 