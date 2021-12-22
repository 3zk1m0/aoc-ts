import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => rawInput.split('\n').map(x=>parseInt(x))

const input = prepareInput(readInput())

const DIVIDER = 20201227

const part1 = () => {

  let x = 1
  let loops = 0
  while (x != input[0] ) {
    x *= 7
    x %= DIVIDER
    loops++
  }

  let y = 1
  for (let i = 0; i < loops; i++) {
    y *= input[1]
    y %= 20201227
  }
  return y
} 


/* Tests */

// test()

/* Results */

runPart("Part One:", part1)


 