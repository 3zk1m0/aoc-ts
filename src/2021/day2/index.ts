import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => rawInput
  .split('\n')
  .map(x => x.split(' '))
  .map(x => [x[0], parseInt(x[1], 10)])

const part1 = (input) => {

  const pos = [0,0]

  input.forEach(([cmd, count]) => {
    if (cmd === "forward") {
      pos[0] += count
    }
    if (cmd === "down") {
      pos[1] += count
    }
    if (cmd === "up") {
      pos[1] -= count
    }
  });

  return pos[0] * pos[1]
}

const part2 = (input) => {

  let pos = [0,0]
  let aim = 0

  input.forEach(([cmd, count]) => {
    if (cmd === "forward") {
      pos[0] += count
      pos[1] += count * aim
    }
    if (cmd === "down") {
      aim += count
    }
    if (cmd === "up") {
      aim -= count
    }
  });
  
  return pos[0] * pos[1]
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}

 