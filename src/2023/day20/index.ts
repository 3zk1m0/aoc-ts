import { test, readInput, runPart, Args } from '../../utils'
import { lcm } from '../../math'

type Input = ReturnType<typeof prepareInput>

type Node = {
  operation: string | null
  name: string
  output: string[]
}

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').reduce((acc, line) => {
    const parts = line.split(' -> ')
    let [_, operation, name] = RegExp(/([%&])(\w+)/).exec(parts[0]) ?? [
      null,
      null,
      parts[0],
    ]
    acc[name] = {
      operation,
      name,
      output: parts[1].split(', '),
    }
    return acc
  }, {} as Record<string, Node>)

type Pulse = [to: string, state: boolean, from: string]

const initMemory = (input: Input) => {
  const flipMemory: Record<string, boolean> = {}
  const conMemory: Record<string, Record<string, boolean>> = {}
  Object.values(input).forEach((node) => {
    if (node.operation !== '&') return
    conMemory[node.name] = {}
    Object.values(input).forEach((m) => {
      if (m.output.includes(node.name)) conMemory[node.name][m.name] = false
    })
  })
  return {
    flip: flipMemory,
    con: conMemory,
  }
}

type Memory = ReturnType<typeof initMemory>

const runNode = (pulse: Pulse, node: Node, memory: Memory) => {
  const { name, output, operation } = node

  switch (operation) {
    case null: {
      return output.map((n) => [n, pulse[1], pulse[0]] as Pulse)
    }
    case '%': {
      if (pulse[1] === true) break
      const memoryState = memory.flip[name] ?? false
      memory.flip[name] = !memoryState
      return output.map((n) => [n, !memoryState, pulse[0]] as Pulse)
    }
    case '&': {
      memory.con[name][pulse[2]] = pulse[1]
      const memoryState = [...Object.values(memory.con[name]!)].every(
        (n) => n === true
      )
      return output.map((n) => [n, !memoryState, pulse[0]] as Pulse)
    }
  }
  return []
}

const part1 = (input: Input) => {
  const result = [0, 0]

  const memory = initMemory(input)

  for (let i = 0; i < 1000; i++) {
    let queue: Pulse[] = [['broadcaster', false, 'button']]

    while (queue.length > 0) {
      const pulse = queue.shift()!

      result[pulse[1] ? 0 : 1]++

      if (!input[pulse[0]]) continue

      const nextPulses = runNode(pulse, input[pulse[0]], memory)
      queue.push(...nextPulses)
    }
  }

  return result[0] * result[1]
}

const part2 = (input: Input) => {
  const toRx = Object.values(input).find((n) => n.output.includes('rx'))!

  const toRxInputs = Object.values(input)
    .filter((n) => n.output.includes(toRx.name))
    .map((n) => n.name)

  const result: Record<string, number | null> = {}
  toRxInputs.forEach((n) => {
    result[n] = null
  })

  const memory = initMemory(input)

  for (let i = 0; i < 1000000; i++) {
    let queue: Pulse[] = [['broadcaster', false, 'button']]

    if (Object.values(result).every((n) => n !== null)) break

    while (queue.length > 0) {
      const pulse = queue.shift()!

      if (!input[pulse[0]]) continue

      if (toRx.name === pulse[0] && pulse[1] && result[pulse[2]] === null) {
        // Add 1 to send the signal to rx
        result[pulse[2]] = i + 1
      }

      const nextPulses = runNode(pulse, input[pulse[0]], memory)
      queue.push(...nextPulses)
    }
  }

  return Object.values(result).reduce((acc, n) => lcm(acc!, n!))
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
