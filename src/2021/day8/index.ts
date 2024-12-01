import { test, readInput, runPart } from '../../utils'

interface Row {
  clues: string[]
  display: string[]
}

type Input = Row[]

const prepareInput = (rawInput: string): Input =>
  rawInput.split('\n').map((row) => {
    const parts = row.split(' | ')
    return {
      clues: parts[0].split(' ').map((x) => [...x].sort().join('')),
      display: parts[1].split(' ').map((x) => [...x].sort().join('')),
    }
  })

const solve = (dataO: string[]) => {
  let data: string[] = JSON.parse(JSON.stringify(dataO))

  const contains = (arr: string, target: string) => {
    return [...arr].every((v) => target.includes(v))
  }

  const findAndRemove = (predicate: (value: string) => boolean) => {
    const result = data.find(predicate)
    data = data.filter((x) => x !== result)
    return result
  }

  // Only ones of given length
  const one = findAndRemove((x) => x.length === 2)
  const four = findAndRemove((x) => x.length === 4)
  const seven = findAndRemove((x) => x.length === 3)
  const eight = findAndRemove((x) => x.length === 7)

  const three = findAndRemove((x) => x.length === 5 && contains(one, x))
  const nine = findAndRemove((x) => x.length === 6 && contains(four, x))
  const zero = findAndRemove((x) => x.length === 6 && contains(one, x)) // not nine
  const six = findAndRemove((x) => x.length === 6) // not zero or nine
  const five = findAndRemove((x) => x.length === 5 && contains(x, six))
  const two = data.find((x) => x.length === 5)

  return {
    [zero]: 0,
    [one]: 1,
    [two]: 2,
    [three]: 3,
    [four]: 4,
    [five]: 5,
    [six]: 6,
    [seven]: 7,
    [eight]: 8,
    [nine]: 9,
  }
}

const part1 = (input: Input) => {
  return input.reduce((r, row) => {
    return r + row.display.filter((x) => [2, 3, 4, 7].includes(x.length)).length
  }, 0)
}

const part2 = (input: Input) => {
  return input.reduce((r, row) => {
    const code = solve(row.clues)
    const data = row.display.map((x) => code[[...x].sort().join('')])
    return r + parseInt(data.join(''), 10)
  }, 0)
}

/* Tests */

// test()

/* Results */

export async function main(args: string) {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
