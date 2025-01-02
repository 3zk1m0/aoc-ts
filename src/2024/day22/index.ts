import { runPart, test } from '../../utils';

type Input = ReturnType<typeof prepareInput>;

const prepareInput = (rawInput: string) => rawInput.trim().split('\n').map(Number);

const mix = (a: number, b: number) => a ^ b
const prune = (n: number) => ((n % 16777216) + 16777216) % 16777216

const evolve = (secret: number) => {
  secret ^= (secret * 64) % 16777216;
  secret ^= Math.floor(secret / 32) % 16777216;
  secret ^= (secret * 2048) % 16777216;
  return secret;
}

const part1 = (input: Input) => {
  return input.map((n) => {
    let secret = n
    for (let i = 0; i < 2000; i++) {
      secret = evolve(secret)
    }
    return secret
  }).reduce((a, b) => a + b, 0)
};

const part2 = (input: Input) => {

  const cache = new Map<string, number>()

  input.forEach((n) => {
    let secret = n
    const previous = []
    const seen = new Set<string>()

    for (let i = 0; i < 2000; i++) {

      const newSecret = evolve(secret)
      const value = secret % 10
      const newValue = newSecret % 10
      secret = newSecret

      previous.push(newValue - value)

      if (i < 4) continue

      const key = previous.slice(-4).join(',')
      if (seen.has(key)) continue
      seen.add(key)

      const cachedValue = cache.get(key) || 0
      cache.set(key, cachedValue + newValue)
    }
  })
 
  return [...cache.entries()].sort((a, b) => b[1] - a[1])[0][1]
};



/* Tests */

test(mix(42, 15), 37)
test(prune(100000000), 16113920)

const testInput1 = prepareInput(`\
1
10
100
2024
`);

const testInput2 = prepareInput(`\
1
2
3
2024
`);

test(part1(testInput1), 37327623);
test(part2(testInput2), 23);

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true);
  runPart('Part One:', () => part1(input));
  runPart('Part Two:', () => part2(input));
};
