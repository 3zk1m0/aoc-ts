import { test, readInput, runPart } from '../../utils'

type Pair = [number | Pair, number | Pair]

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((row) => JSON.parse(row))

const split = (pair: string) => {
  return pair.replace(/\d{2,}/, (val) => {
    return JSON.stringify([Math.floor(+val / 2), Math.ceil(+val / 2)])
  })
}

const explode = (str: string) => {
  let depth = 0
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '[') depth++
    else if (str[i] === ']') depth--
    else if (depth >= 5) {
      const [x, l, r] = str.slice(i).match(/(\d+),(\d+)/)
      const left = str
        .slice(0, i - 1)
        .replace(/(\d+)(\D+)$/, (_, d, p) => `${+d + +l}${p}`)
      const right = str
        .slice(i + x.length + 1)
        .replace(/(\d+)/, (d) => `${+d + +r}`)
      return `${left}0${right}`
    }
  }
  return str
}

const reduceNumber = (pair: Pair) => {
  let str = JSON.stringify(pair)
  while (true) {
    const previous = str
    if ((str = explode(str)) !== previous) continue
    if ((str = split(str)) !== previous) continue
    return JSON.parse(previous)
  }
}

const magnitude = (pair: Pair | number): number => {
  if (typeof pair === 'number') return pair
  return 3 * magnitude(pair[0]) + 2 * magnitude(pair[1])
}

const part1 = (input: Pair[]) => {
  const result = input
    .slice(1)
    .reduce((r, row) => reduceNumber([r, row]), input[0])
  return magnitude(result)
}

const part2 = (input: Pair[]) => {
  let max = 0
  for (let y of input) {
    for (let x of input) {
      if (x == y) continue
      max = Math.max(max, magnitude(reduceNumber([x, y])))
    }
  }
  return max
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
