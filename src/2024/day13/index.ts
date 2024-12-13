import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.split('\n\n').map((x) => {
  const a = x.match(/A: X\+(\d+), Y\+(\d+)/)?.slice(1, 3).map(Number)!
  const b = x.match(/B: X\+(\d+), Y\+(\d+)/)?.slice(1, 3).map(Number)!
  const prize = x.match(/X=(\d+), Y=(\d+)/)?.slice(1, 3).map(Number)!
  return { a, b, prize }
})


const day = (input: Input, part2 = false) => {
  const result = input.reduce((acc, { a, b, prize }) => {
    const [ax, ay] = a;
    const [bx, by] = b;
    const [px, py] = part2 ? prize.map(x => x + 10000000000000) : prize;

    const m = Math.floor((px * by - py * bx) / (ax * by - ay * bx));
    if (m * (ax * by - ay * bx) !== (px * by - py * bx)) {
      return acc;
    }
    const n = Math.floor((py - ay * m) / by);
    if (n * by !== (py - ay * m)) {
      return acc;
    }

    return acc + 3 * m + n;
  }, 0);
  return result;
}

/* Tests */

const exampleInput = prepareInput(`\
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`)

test(day(exampleInput), 480)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => day(input))
  runPart('Part Two:', () => day(input, true))
}
