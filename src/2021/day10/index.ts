import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => rawInput.split('\n')


const PAIRS = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
}

const SCORE_A = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const SCORE_B = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

const checkSyntax = (data:string) => {

  const stack = []

  for (let i in [...data]) {
    const char = data[i]
    if ('([{<'.includes(char)) {
      stack.push(char)
      continue
    }
    const last = stack.pop()
    if (PAIRS[last] !== char) {
      return parseInt(i, 10)
    }
  }
  return -1
}

const part1 = (input:string[]) => {

  return input
    .map(x => [x, checkSyntax(x)])
    .filter(x => x[1] >= 0)
    .map(x => x[0][x[1]])
    .map(x => SCORE_A[x])
    .reduce((r,x) => r + x, 0)

}

const findMissing = (data:string) => {
  const stack = []

  for (let i in [...data]) {
    const char = data[i]
    if ('([{<'.includes(char)) {
      stack.push(char)
      continue
    }
    stack.pop()
  }
  return stack.map(x => PAIRS[x]).reverse()
}


const part2 = (input) => {
 
  const rows = input
    .filter(row => checkSyntax(row) === -1)
    .map(row => findMissing(row))
    .map(data => data.reduce((r, x) => r * 5 + SCORE_B[x], 0))
    .sort((a,b) => a - b)
  
  const middleIndex = Math.floor(rows.length/2)
  return rows[middleIndex]
}

/* Tests */

test(checkSyntax('{([(<{}[<>[]}>{[]{[(<()>)'), 12)
test(checkSyntax('[[<[([]))<([[{}[[()]]]'), 8)
test(checkSyntax('[{[{({}]{}}([{[{{{}}([]'), 7)
test(checkSyntax('[<(<(<(<{}))><([]([]()'), 10)
test(checkSyntax('<{([([[(<>()){}]>(<<{{'), 16)

test(findMissing('[({(<(())[]>[[{[]{<()<>>'), '}}]])})]'.split(''))
test(findMissing('[(()[<>])]({[<{<<[]>>('), ')}>]})'.split(''))
test(findMissing('(((({<>}<{<{<>}{[]{[]{}'), '}}>}>))))'.split(''))
test(findMissing('{<[[]]>}<{[{[{[]{()[[[]'), ']]}}]}]}>'.split(''))
test(findMissing('<{([{{}}[<[[[<>{}]]]>[]]'), '])}>'.split(''))

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}

 