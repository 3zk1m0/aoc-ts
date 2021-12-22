import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => rawInput.split(',').map(x => parseInt(x))

const part = (input, partB=false) => {

  let max = 0
  const positions:Record<string,number> = input.reduce((r,x) => {
    max = Math.max(max, x)
    r[x] = (r[x] || 0) + 1
    return r
  }, {})

  let leastFuel = Infinity
  for (let target = 0; target <= max; target++) {
    const totalFuel = Object
      .entries(positions)
      .reduce((r,x) => {
        const [pos, count] = [parseInt(x[0]), x[1]]
        const distance = Math.abs(target-pos)
        const fuel = partB ? (distance / 2) * (1 + distance) : distance
        r += fuel * count
        return r
      }, 0)
    leastFuel = Math.min(leastFuel, totalFuel)
  }

  return leastFuel
}


/* Tests */

// test()

/* Results */

const part1 = (input) => part(input,false)
const part2 = (input) => part(input,true)

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}

 