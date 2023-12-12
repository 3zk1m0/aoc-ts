import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => {
    const parts = line.split(' ')
    return {
      str: parts[0],
      checksum: parts[1].split(',').map((x) => parseInt(x, 10)),
    }
  })

const getSolver = () => {
  const cache = new Map<string, number>()
  const solve = (str: string, withinRun: number, remain: number[]) => {
    const key = `${str}-${withinRun}-${remain.join(',')}`
    if (cache.has(key)) return cache.get(key)!

    const isRunning = withinRun > 0

    if (!str) {
      if (!isRunning && remain.length === 0) {
        return 1
      }
      if (remain.length === 1 && isRunning && withinRun === remain[0]) {
        return 1
      }
      return 0
    }

    const possibleMore = str.replaceAll('.', '').length
    const remainingCount = remain.reduce((acc, cur) => acc + cur, 0)

    if (isRunning) {
      if (possibleMore + withinRun < remainingCount) return 0
      if (remain.length === 0) return 0
    } else if (possibleMore < remainingCount) {
      return 0
    }

    let poss = 0
    const nextStr = str.slice(1)
    const isFulfilled = withinRun === remain[0]

    if (str.startsWith('.') && isRunning) {
      if (!isFulfilled) return 0
      poss += solve(nextStr, 0, remain.slice(1))
    }
    if (str.startsWith('?') && isRunning && isFulfilled) {
      poss += solve(nextStr, 0, remain.slice(1))
    }
    if (!str.startsWith('.')) {
      if (isRunning) poss += solve(nextStr, withinRun + 1, remain)
      else poss += solve(nextStr, 1, remain)
    }
    if (!str.startsWith('#') && !isRunning) {
      poss += solve(nextStr, 0, remain)
    }

    cache.set(key, poss)
    return poss
  }
  return solve
}

const part1 = (input: Input) => {
  const solve = getSolver()
  return input.reduce((acc, { str, checksum }) => {
    return acc + solve(str, 0, checksum)
  }, 0)
}

const part2 = (input: Input) => {
  const solve = getSolver()

  return input.reduce((acc, { str, checksum }) => {
    const newStr = Array.from({ length: 5 }, () => str).join('?')
    const newChecksum = Array.from({ length: 5 }, () => checksum).flat()
    return acc + solve(newStr, 0, newChecksum)
  }, 0)
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
