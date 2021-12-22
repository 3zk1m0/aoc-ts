import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) => {
  return rawInput.split('\n\n').map(x => x.split('\n'))
}

const input:string[][] = prepareInput(readInput())

const part1 = () => {

  return input
    .map(x => new Set(x.join('').split('')).size)
    .reduce((x,y) => x+y,0)

}

const part2 = () => {
  
  return input.map(x => {
    let data = [...new Set(x.join('').split('')).keys()]
    for (const person of x) {
      const p = person.split('')
      data = data.filter(letter => p.includes(letter))
    }
    return data.length
  }).reduce((x,y)=> x+y,0)

}

/* Tests */

// test()

/* Results */

runPart("Part One:", part1)
runPart("Part Two:", part2)
