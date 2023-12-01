import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) => rawInput.split('\n')

const part1 = (input: string[]) => {
  return input.reduce((acc, line) => {
    const res = [...line].reduce((lineAcc, char) => {
      if (!isNaN(parseInt(char))) {
        lineAcc.push(char)
      }
      return lineAcc
    }, [])
    return acc + parseInt(res[0] + res[res.length - 1])
  }, 0)
}

const DIGITS = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  zero: '0',
}

const part2 = (input: string[]) => {
  return input.reduce((acc, curr) => {
    const res = [...curr].reduce((lineAcc, char, i) => {
      if (!isNaN(parseInt(char))) {
        lineAcc.push(char)
      }
      const str = curr.slice(i)
      Object.keys(DIGITS).forEach((key) => {
        if (str.startsWith(key)) {
          lineAcc.push(DIGITS[key])
        }
      })
      return lineAcc
    }, [])

    return acc + parseInt(res[0] + res[res.length - 1])
  }, 0)
}

/* Tests */

const SAMPLE_PART_1 = ['1abc2', 'pqr3stu8vwx', 'a1b2c3d4e5f', 'treb7uchet']

test(part1([SAMPLE_PART_1[0]]), 12)
test(part1([SAMPLE_PART_1[1]]), 38)
test(part1([SAMPLE_PART_1[2]]), 15)
test(part1([SAMPLE_PART_1[3]]), 77)
test(part1(SAMPLE_PART_1), 142)

const SAMPLE_PART_2 = [
  'two1nine',
  'eightwothree',
  'abcone2threexyz',
  'xtwone3four',
  '4nineeightseven2',
  'zoneight234',
  '7pqrstsixteen',
]

test(part2([SAMPLE_PART_2[0]]), 29)
test(part2([SAMPLE_PART_2[1]]), 83)
test(part2([SAMPLE_PART_2[2]]), 13)
test(part2([SAMPLE_PART_2[3]]), 24)
test(part2([SAMPLE_PART_2[4]]), 42)
test(part2([SAMPLE_PART_2[5]]), 14)
test(part2([SAMPLE_PART_2[6]]), 76)
test(part2(SAMPLE_PART_2), 281)

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
