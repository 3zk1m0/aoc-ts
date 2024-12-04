import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.trim().split('\n')

const DIR = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const part1 = (input: Input) => {

  let result = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] != "X") continue
      result += DIR.reduce((acc, [dy, dx]) => {
        const containsM = input?.[y + dy]?.[x + dx] === "M"
        const containsA = input?.[y + 2 * dy]?.[x + 2 * dx] === "A"
        const containsS = input?.[y + 3 * dy]?.[x + 3 * dx] === "S"
        const containsMAS = containsM && containsA && containsS
        return acc + (containsMAS ? 1 : 0)
      }, 0)
    }
  }
  return result;
}

const part2 = (input: Input) => {
  let result = 0;

  for (let y = 1; y < input.length - 1; y++) {
    for (let x = 1; x < input[y].length - 1; x++) {
      if (input[y][x] !== "A") continue
      let count = 0;
      if (input[y - 1][x - 1] == "M" && input[y + 1][x + 1] == "S") count++;
      if (input[y + 1][x + 1] == "M" && input[y - 1][x - 1] == "S") count++;
      if (input[y + 1][x - 1] == "M" && input[y - 1][x + 1] == "S") count++;
      if (input[y - 1][x + 1] == "M" && input[y + 1][x - 1] == "S") count++;
      if (count == 2) result++;
    }
  }
  return result;
}

/* Tests */

const testInput = prepareInput(`\
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`)

test(part1(testInput), 18)
test(part2(testInput), 9)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
