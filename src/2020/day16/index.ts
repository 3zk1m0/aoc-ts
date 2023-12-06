import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string): Input => {
  const parts = rawInput.split('\n\n')
  const rules = parts[0].split('\n').map((x) => ({
    name: x.split(': ')[0],
    boundaries: (x.match(/\d*-\d*/g) || []).map((x) =>
      x.split('-').map((x) => parseInt(x))
    ),
    values: new Set(
      (x.match(/\d*-\d*/g) || [])
        .map((x) => {
          const xy = x.split('-').map((x) => parseInt(x))
          const res: number[] = []
          for (let i = xy[0]; i <= xy[1]; i++) {
            res.push(i)
          }
          return res
        })
        .flat()
    ),
  }))
  const myTicket = parts[1]
    .split('\n')[1]
    .split(',')
    .map((x) => parseInt(x))
  const tickets = parts[2]
    .split('\n')
    .slice(1)
    .map((x) => x.split(',').map((x) => parseInt(x)))
  return { rules, myTicket, tickets }
}

const input = prepareInput(readInput())

interface Rule {
  name: string
  boundaries: number[][]
  values: Set<number>
}

type Input = {
  rules: Rule[]
  myTicket: number[]
  tickets: number[][]
}

const part1 = () => {
  let invalid = 0

  let validNumbers = new Set()
  for (const rule of input.rules) {
    rule.values.forEach((x) => validNumbers.add(x))
  }

  for (const ticket of input.tickets) {
    for (const value of ticket) {
      if (!validNumbers.has(value)) invalid += value
    }
  }

  return invalid
}

const part2 = () => {
  const { rules, myTicket, tickets }: Input = input

  let validNumbers = new Set()
  for (const rule of rules) {
    rule.values.forEach((x) => validNumbers.add(x))
  }

  const invalid: number[] = []

  for (const i in tickets) {
    for (const value of tickets[i]) {
      if (!validNumbers.has(value)) invalid.push(parseInt(i))
    }
  }

  for (var i = invalid.length - 1; i >= 0; i--) tickets.splice(invalid[i], 1)

  const fields = {}
  rules.forEach((x) => (fields[x.name] = []))

  for (let i = 0; i < tickets[0].length; i++) {
    for (const rule of rules) {
      let valid = true
      for (const ticket of tickets) {
        if (!rule.values.has(ticket[i])) valid = false
      }
      if (valid) fields[rule.name].push(i)
    }
  }

  const mapping = {}

  while (Object.keys(fields).length) {
    for (const key in fields) {
      if (fields[key].length == 1) {
        const tmp = fields[key][0]
        for (const i in fields) {
          fields[i] = fields[i].filter((x) => x != tmp)
        }
        mapping[key] = tmp
        delete fields[key]
        break
      }
    }
  }

  let result = 1

  for (const key in mapping) {
    if (key.includes('departure')) {
      result *= myTicket[mapping[key]]
    }
  }

  return result
}

/* Tests */

// test()

/* Results */

runPart('Part One:', part1)
runPart('Part Two:', part2)
