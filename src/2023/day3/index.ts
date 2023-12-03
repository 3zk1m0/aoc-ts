import { test, readInput, runPart } from '../../utils'

type Input = string[][]

const prepareInput = (rawInput: string): Input =>
  rawInput.split('\n').map((row) => row.split(''))

const getPositionsAroundNumber = (i: number, j: number, value: string) => {
  return value
    .split('')
    .map((_, k) => ({ i, j: j + k }))
    .reduce((acc, p) => acc.concat(getNeighbors(p.i, p.j)), [])
}

const getNeighbors = (i: number, j: number) => {
  const positions = []
  for (let k = i - 1; k <= i + 1; k++) {
    for (let l = j - 1; l <= j + 1; l++) {
      if (k === i && l === j) continue
      positions.push({ i: k, j: l })
    }
  }
  return positions
}

const part1 = (input: Input) => {
  const parts = input.reduce((acc, row, i) => {
    row.forEach((char, j) => {
      if (!char.match(/[\d\.]/)) acc.push({ i, j })
    })
    return acc
  }, [] as { i: number; j: number }[])

  const numbers = input.reduce((acc, row, i) => {
    const str = row.join('')
    const match = [...str.matchAll(/(\d+)/g)]
    match.forEach((m) => {
      acc.push({ i, j: m.index, value: parseInt(m[1]) })
    })
    return acc
  }, [] as { i: number; j: number; value: number }[])

  const partNumbers = numbers.filter((x) => {
    const points = getPositionsAroundNumber(x.i, x.j, x.value.toString())
    const tags = points
      .map((p) => parts.find((x) => x.i == p.i && x.j == p.j))
      .filter((x) => x)
    return tags.length > 0
  })

  return partNumbers.reduce((acc, x) => acc + x.value, 0)
}

const part2 = (input: Input) => {
  const gearParts = input.reduce((acc, row, i) => {
    row.forEach((char, j) => {
      if (char == '*') {
        acc.push({ i, j, ratios: [] })
      }
    })
    return acc
  }, [] as { i: number; j: number; ratios: number[] }[])

  input.forEach((row, i) => {
    const match = [...row.join('').matchAll(/(\d+)/g)]
    match.forEach((m) => {
      const tags = getPositionsAroundNumber(i, m.index, m[1])
        .map((p) => gearParts.find((x) => x.i == p.i && x.j == p.j))
        .filter((x) => x)
      if (tags[0]) {
        tags[0].ratios.push(parseInt(m[1]))
      }
    })
  })

  return gearParts
    .filter((x) => x.ratios.length > 1)
    .map((x) => x.ratios.reduce((acc, y) => acc * y, 1))
    .reduce((acc, x) => acc + x, 0)
}

/* Tests */

const SAMPLE_INPUT = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`

const sampleData = prepareInput(SAMPLE_INPUT)

test(part1(sampleData), 4361)
test(part2(sampleData), 467835)

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
