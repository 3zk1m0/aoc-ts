import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) => {
  const parts = rawInput.split('\n\n')

  return {
    template: parts[0],
    pairs: [...parts[0]].reduce((r, x, i, a) => {
      if (i === 0) return r
      const pair = a[i - 1] + x
      r[pair] = r[pair] ? r[pair] + 1 : 1
      return r
    }, {}),
    rules: parts[1]
      .split('\n')
      .map((row) => row.split(' -> '))
      .reduce((r, x) => {
        r[x[0]] = x[1]
        return r
      }, {}),
  }
}

const step2 = (pairs, rules) => {
  return Object.entries(pairs).reduce((r, [k, v]) => {
    if (rules[k]) {
      r[k[0] + rules[k]] = r[k[0] + rules[k]] ? r[k[0] + rules[k]] + v : v
      r[rules[k] + k[1]] = r[rules[k] + k[1]] ? r[rules[k] + k[1]] + v : v
    } else {
      r[k] = r[k] ? r[k] + v : v
    }
    return r
  }, {})
}

const run = (input, steps) => {
  let { template, pairs, rules } = input

  for (let i = 0; i < steps; i++) {
    pairs = step2(pairs, rules)
  }

  const counts = Object.entries(pairs).reduce((r, [k, v]) => {
    r[k[0]] = r[k[0]] ? r[k[0]] + v : v
    r[k[1]] = r[k[1]] ? r[k[1]] + v : v
    return r
  }, {})

  counts[template[0]] = counts[template[0]] ? counts[template[0]] + 1 : 1
  counts[template[template.length - 1]] = counts[template[template.length - 1]]
    ? counts[template[template.length - 1]] + 1
    : 1

  const max = Object.values<number>(counts).reduce((r, x) => Math.max(r, x), 0)
  const min = Object.values<number>(counts).reduce(
    (r, x) => Math.min(r, x),
    Infinity
  )

  return (max - min) / 2
}

const part1 = (input) => {
  return run(input, 10)
}

const part2 = (input) => {
  return run(input, 40)
}

/* Tests */

// test()

/* Results */

export async function main(args: string) {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
