import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((x) => x.replace(/\s/g, ''))

const input = prepareInput(readInput())

const evaluate = (calc: string, evalMath: Function) => {
  let offset = 0
  while (calc.includes('(')) {
    const pStart = calc.indexOf('(', offset)
    const pEnd = calc.indexOf(')', pStart)
    const inside = calc.slice(pStart + 1, pEnd)
    if (inside.includes('(')) {
      offset = pStart + 1
      continue
    }
    const value = evalMath(inside)
    calc = calc.slice(0, pStart) + value + calc.slice(pEnd + 1)
  }

  return parseInt(evalMath(calc))
}

const evalMathA = (calc: string) => {
  while (calc.includes('+') || calc.includes('*')) {
    const part = (calc.match(/\d+.\d+/g) || [])[0]
    const value = eval(part)
    calc = value + calc.slice(part.length)
  }
  return calc
}

const evalMathB = (calc: string) => {
  while (calc.includes('+')) {
    const part = (calc.match(/\d+\+\d+/g) || [])[0]
    const value = eval(part)
    calc = calc.replace(part, value)
  }
  while (calc.includes('*')) {
    const part = (calc.match(/\d+\*\d+/g) || [])[0]
    const value = eval(part)
    calc = calc.replace(part, value)
  }
  return calc
}

const part1 = () => input.reduce((a, b) => a + evaluate(b, evalMathA), 0)
const part2 = () => input.reduce((a, b) => a + evaluate(b, evalMathB), 0)

/* Tests */

// test()

/* Results */

runPart('Part One:', part1)
runPart('Part Two:', part2)
