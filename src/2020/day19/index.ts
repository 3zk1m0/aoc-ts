import * as _ from 'lodash'
import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) => {
  const parts = rawInput.split('\n\n')

  const ruleBook = new Map()
  parts[0].split('\n').forEach((rule) => {
    const [index, rulesUnsplit] = rule.split(': ')
    const rules = rulesUnsplit.split(' | ')
    const value = rules[0].includes('"')
      ? rules[0][1]
      : rules.map((c) => c.split(' ').map((n) => parseInt(n)))
    ruleBook.set(parseInt(index), value)
  })

  return {
    rules: ruleBook,
    messages: parts[1].split('\n'),
  }
}

const input = prepareInput(readInput())

const rules = input.rules

const checkLine = (message: string, stack) => {
  if (stack.length > message.length) return false
  else if (stack.length == 0 || message.length == 0)
    return stack.length == 0 && message.length == 0

  const c = stack.pop()
  if (typeof c == 'string') {
    if (message[0] == c) return checkLine(message.slice(1), stack.slice())
  } else {
    for (const rule of rules.get(c)) {
      const newStack =
        typeof rule == 'string'
          ? stack.concat([rule])
          : stack.concat([...rule.slice().reverse()])
      if (checkLine(message, newStack)) return true
    }
  }
  return false
}

const part1 = () => {
  return input.messages.filter((message) =>
    checkLine(message, [...rules.get(0)[0].slice().reverse()])
  ).length
}

const part2 = () => {
  rules.set(8, [[42], [42, 8]])
  rules.set(11, [
    [42, 31],
    [42, 11, 31],
  ])
  return input.messages.filter((message) =>
    checkLine(message, [...rules.get(0)[0].slice().reverse()])
  ).length
}

// Part 1: 115
// Part 2: 237

/* Tests */

// test()

/* Results */

runPart('Part One:', part1)
runPart('Part Two:', part2)
