import { test, readInput, runPart } from '../../utils'

type Input = Record<string,Set<string>>

const prepareInput = (rawInput: string):Input => rawInput
  .split('\n')
  .map(row => row.split('-'))
  .reduce((r,x) => {
    r[x[0]] = r[x[0]] || new Set()
    r[x[1]] = r[x[1]] || new Set()
    r[x[0]].add(x[1])
    r[x[1]].add(x[0])
    return r
  }, {})


const hasLowerDublicate = (array:string[]) => {
  const dublicates = array
    .filter(x => x.toLowerCase() === x)
    .filter((item, index, arr) => arr.indexOf(item) != index)
  
  return dublicates.length > 0
}

const checkIfAllowed = (value:string, array:string[], allowDublicate=false) => {
  if (value === 'start') {
    return false
  }
  if (value.toUpperCase() === value) {
    return true
  }
  if (array.includes(value)) {
    if (allowDublicate && !hasLowerDublicate(array)) {
      return true
    }
    return false
  }
  return true
}

const getPossiblePaths = (history:string[], paths:Input, allowDublicate=false) => {
  const current = history[history.length-1]
  const possiblePaths = [...paths[current].keys()]
  return possiblePaths.filter(x => checkIfAllowed(x, history, allowDublicate))
}

const recureseWrapper = (paths:Input, partB=false) => {

  const resultPaths = []

  const travelPath = (history:string[]=['start']) => {
    const current = history[history.length-1]
    if (current === 'end') {
      resultPaths.push([...history, current])
      return
    }
    getPossiblePaths(history, paths, partB)
      .forEach(path => travelPath([...history, path]))
  }

  travelPath()
  return resultPaths
}

const part1 = (input:Input) => {
  return recureseWrapper(input).length
}

const part2 = (input:Input) => {
  return recureseWrapper(input, true).length
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}
