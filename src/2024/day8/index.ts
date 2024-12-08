import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

interface Node {
  freq: string,
  x: number,
  y: number
}

const prepareInput = (rawInput: string) => {
  const grid = rawInput.trim().split('\n').map(row => row.split(""))
  const groups = {} as Record<string,Node[]>
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      const value = grid[y][x]
      if (value === ".") continue
      if (!groups[value]) groups[value] = []
      groups[value].push({
        freq: value,
        x,y
      })
    }
  }
  return {
    antennaGroups: groups,
    width: grid[0].length,
    height: grid.length
  }
}

const day = (input: Input, part2 = false) => {

  let antinodes = new Set<string>()

  const combs = Object.values(input.antennaGroups).reduce((acc, group) => {
    return acc.concat(group.flatMap((v, i) => group.slice(i+1).map( w => [v,w] as [Node, Node])))
  }, [] as [Node, Node][])

  for (let comb of combs) {
    const diffX = comb[0].x - comb[1].x
    const diffY = comb[0].y - comb[1].y

    const pos1 = {x: comb[0].x+diffX, y: comb[0].y+diffY}
    const pos2 = {x: comb[1].x-diffX, y: comb[1].y-diffY}

    if (part2) {
      antinodes.add(comb[0].x + ',' + comb[0].y)
      antinodes.add(comb[1].x + ',' + comb[1].y)
    }

    while (pos1.x >= 0 && pos1.x < input.width && pos1.y >= 0 && pos1.y < input.height) {
      antinodes.add(pos1.x + ',' + pos1.y)
      pos1.x += diffX
      pos1.y += diffY
      if (!part2) break
    }
    while (pos2.x >= 0 && pos2.x < input.width && pos2.y >= 0 && pos2.y < input.height) {
      antinodes.add(pos2.x + ',' + pos2.y)
      pos2.x -= diffX
      pos2.y -= diffY
      if (!part2) break
    }

  }

  return antinodes.size
}

/* Tests */

const testInput = prepareInput(`\
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`)

test(day(testInput), 14)
test(day(testInput, true), 34)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => day(input))
  runPart('Part Two:', () => day(input, true))
}
