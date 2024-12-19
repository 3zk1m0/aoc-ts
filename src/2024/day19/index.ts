import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => {
  const [patternStr, designStr] = rawInput.trim().split('\n\n')
  return {
    patterns: patternStr.split(', '),
    desings: designStr.split('\n')
  }
}

const part1 = (input: Input) => {
  const regex = input.patterns.map(d => `(${d})`).join('|')
  return input.desings.filter(desing => {
    const match = desing.match(`^(${regex})+$`)
    return match
  }).length
}


const fnCache = <T, I>(fn: (input: I) => T): (input: I) => T => {
  const cache = new Map<I, T>()
  return (input: I) => {
    const cached = cache.get(input)
    if (cached) return cached
    const result = fn(input)
    cache.set(input, result)
    return result
  }
}

const part2 = (input: Input) => {

  const findCombinations = fnCache((design: string): number => {
    return input.patterns.reduce((acc, p) => {
      if (!design.startsWith(p)) {
        return acc
      }
      const rest = design.slice(p.length)
      if (rest.length === 0) {
        return acc + 1
      }
      return acc + findCombinations(rest)
    }, 0)
  })

  return input.desings.reduce((acc, pattern) => acc + findCombinations(pattern), 0)
}

/* Tests */

const testInput = prepareInput(`\
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`)

test(part1(testInput), 6)
test(part2(testInput), 16)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
