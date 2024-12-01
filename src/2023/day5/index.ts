import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) => {
  const sections = rawInput.split('\n\n').map((x) =>
    x
      .split(/:\s/)[1]
      .split('\n')
      .map((x) => x.split(' ').map(Number))
  )
  return {
    seeds: sections[0][0],
    mappings: sections.slice(1),
  }
}

const part1 = (input: ReturnType<typeof prepareInput>) => {
  return input.seeds.reduce((lowest, seed) => {
    const location = input.mappings.reduce((seed2, mapping) => {
      for (let seedMap of mapping) {
        const [destination, source, range] = seedMap
        if (seed2 >= source && seed2 < source + range) {
          return seed2 + destination - source
        }
      }
      return seed2
    }, seed)

    return location < lowest ? location : lowest
  }, Infinity)
}

const part2 = (input: ReturnType<typeof prepareInput>) => {
  const seeds = input.seeds.reduce(function (result, value, index, array) {
    if (index % 2 === 0) result.push(array.slice(index, index + 2))
    return result
  }, []) as [number, number][]

  let res = Infinity
  for (let [s, o] of seeds) {
    let ranges = [[s, s + o - 1]]

    for (let mapping of input.mappings) {
      let newRanges = []
      for (let [l, h] of ranges) {
        const hit = mapping.some(([destination, source, range]) => {
          if (l >= source && h < source + range) {
            newRanges.push([l - source + destination, h - source + destination])
            return true
          } else if (l < source && h >= source && h < source + range) {
            ranges.push([l, source - 1])
            newRanges.push([destination, destination + h - source])
            return true
          } else if (l < source + range && h >= source + range && l >= source) {
            ranges.push([source + range, h])
            newRanges.push([destination + l - source, destination + range - 1])
            return true
          } else if (l < source && h >= source + range) {
            ranges.push([l, source - 1])
            newRanges.push([destination, destination + range - 1])
            ranges.push([source + range, h])
            return true
          }
        })
        if (!hit) newRanges.push([l, h])
      }
      ranges = newRanges.slice()
    }

    res = Math.min(res, ...ranges.map((x) => x[0]))
  }

  return res
}

/* Tests */

const SAMPLE_DATA = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

const sampleInput = prepareInput(SAMPLE_DATA)

test(part1(sampleInput), 35)
test(part2(sampleInput), 46)

/* Results */

export async function main(args: string) {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
