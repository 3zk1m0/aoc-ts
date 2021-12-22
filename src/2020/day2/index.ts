import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) => {
  return rawInput.split('\n').map(x => {
    const parts = x.split(' ')
    return {
      limits: parts[0].split('-'),
      letter: parts[1][0],
      password: parts[2]
    }
  })
}

const input = prepareInput(readInput())

const part1 = () => {

  const checkValid = (line) => {
    const occurance = [...line.password].reduce((a, e) => { a[e] = a[e] ? a[e] + 1 : 1; return a }, {}); 
    if (line.limits[0] <= occurance[line.letter] && occurance[line.letter] <= line.limits[1])
      return true
  
    return false
  }

  return input.filter(x => checkValid(x)).length
}

const part2 = () => {

  const checkValid = (line) => {
    const matching = line.limits.map(x => {
      return [...line.password][x-1] == line.letter
    }).filter(x => x).length
    
    return matching == 1 ? true : false

  }

  return input.filter(x => checkValid(x)).length
}

/* Tests */

// test(checkValid({ limits: [ '2', '13' ], letter: 'j', password: 'jjjjjjjbjjjjj' },), true)


/* Results */

runPart("Part One:", part1)
runPart("Part Two:", part2)
