import { lcm } from '../../math'
import { test, readInput, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => {
  const sections = rawInput.split('\n\n')
  const network = sections[1].split('\n').reduce((acc, line) => {
    const parts = line.match(/(\w{3}) = \((\w{3}), (\w{3})\)/)
    acc[parts[1]] = {
      left: parts[2],
      right: parts[3],
    }
    return acc
  }, {})
  return {
    path: sections[0].split('\n')[0],
    network: network,
  }
}

const part1 = (input: Input) => {
  let current = 'AAA'

  for (let i = 0; true; i++) {
    if (current === 'ZZZ') return i
    const next = input.network[current]
    const instruction = input.path[i % input.path.length]
    current = instruction === 'R' ? next.right : next.left
  }
}

const part2 = (input: Input) => {
  let currents = Object.keys(input.network).filter((node) => node[2] == 'A')

  let re2 = currents.map((node) => {
    for (let i = 0; true; i++) {
      if (node[2] === 'Z') return i
      const next = input.network[node]
      const instruction = input.path[i % input.path.length]
      node = instruction === 'R' ? next.right : next.left
    }
  })

  return re2.reduce(lcm)
}

/* Tests */

const SAMPLE_DATA_1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`

const sampleInput1 = prepareInput(SAMPLE_DATA_1)

test(part1(sampleInput1), 2)

const SAMPLE_DATA_2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

const sampleInput2 = prepareInput(SAMPLE_DATA_2)

test(part1(sampleInput2), 6)

const SAMPLE_DATA_3 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`

const sampleInput3 = prepareInput(SAMPLE_DATA_3)

test(part2(sampleInput3), 6)

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
