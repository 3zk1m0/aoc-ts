import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string): CodeRow[] => {
  return rawInput.split('\n').map((x) => {
    const data = x.split(' ')
    return [data[0], parseInt(data[1])]
  })
}

const input = prepareInput(readInput())

type CodeRow = [String, Number]

class Computer {
  accumulator = 0
  pointer = 0
  code
  constructor(code: CodeRow[]) {
    this.code = JSON.parse(JSON.stringify(code))
  }

  run() {
    if (this.pointer >= this.code.length) return 0
    this[this.code[this.pointer][0]]()
  }

  acc() {
    this.accumulator += this.code[this.pointer][1]
    this.pointer++
  }

  jmp() {
    this.pointer += this.code[this.pointer][1]
  }

  nop() {
    this.pointer++
  }
}

const part1 = () => {
  const pc = new Computer(input)
  const visited = new Set()
  while (true) {
    if (visited.has(pc.pointer)) break
    visited.add(pc.pointer)
    pc.run()
  }

  return pc.accumulator
}

const part2 = () => {
  const visited = new Set()
  const numbers = input
    .map((x, i) => {
      if (x[0] == 'jmp') return i
    })
    .filter((x) => typeof x != 'undefined') as number[]

  for (const x of numbers) {
    const data = JSON.parse(JSON.stringify(input))
    data[x][0] = 'nop'
    const pc = new Computer(data)
    const visited = new Set()
    while (!visited.has(pc.pointer)) {
      visited.add(pc.pointer)
      if (pc.run() == 0) return pc.accumulator
    }
  }

  return
}

/* Tests */

// test()

/* Results */

runPart('Part One:', part1)
runPart('Part Two:', part2)
