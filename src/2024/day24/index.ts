import { match } from 'assert'
import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

interface Gate {
  a: string
  op: string
  b: string
  output: string
}

const prepareInput = (rawInput: string) => {
  const [inputsStr, logicStr] = rawInput.trim().split('\n\n')
  const gates = logicStr.split('\n').map(line => {
    const split = line.split(' ')
    return {
      a: split[0],
      op: split[1],
      b: split[2],
      output: split[4]
    }
  })
  const inputs = inputsStr
    .split('\n')
    .map(line => line.split(': '))
    .map(([name, value]) => [name, Number(value)] as [string, number])
  return {
    inputs,
    gates
  }
}

const part1 = (input: Input) => {

  const memory = new Map<string, number>()
  input.inputs.forEach(([name, value]) => memory.set(name, value))

  let gates = structuredClone(input.gates)

  while (gates.length > 0) {
    gates = gates.filter(({ a, op, b, output }) => {
      let valueA = memory.get(a)
      let valueB = memory.get(b)
      if (valueA === undefined || valueB === undefined) return true
      if (op === 'AND') memory.set(output, valueA & valueB)
      if (op === 'OR') memory.set(output, valueA | valueB)
      if (op === 'XOR') memory.set(output, valueA ^ valueB)
      return false
    })
  }

  return parseInt([...memory.entries()]
    .filter(([name]) => name.startsWith('z'))
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([, value]) => value.toString())
    .join(''), 2)
}

const simulate = (gates: string[][], memory: Map<string, number>) => {
  let localGates = structuredClone(gates)
  while (localGates.length > 0) {
    localGates = localGates.filter(([a, op, b, out]) => {
      let valueA = memory.get(a)
      let valueB = memory.get(b)
      if (valueA === undefined || valueB === undefined) return true
      if (op === 'AND') memory.set(out, valueA & valueB)
      if (op === 'OR') memory.set(out, valueA | valueB)
      if (op === 'XOR') memory.set(out, valueA ^ valueB)
      return false
    })
  }

  const output = [...memory.entries()].filter(([name, value]) => name.startsWith('z')).sort((a, b) => b[0].localeCompare(a[0])).map(([name, value]) => value.toString()).join('')
  return parseInt(output, 2)
}

const part2 = (input: Input) => {

  const inputBitCount = input.inputs.length / 2;

  const flags = new Set<string>();

  // FULL ADDER
  // A    XOR B    -> VAL0     <= FAGate0
  // A    AND B    -> VAL1     <= FAGate1
  // VAL0 AND CIN  -> VAL2     <= FAGate2
  // VAL0 XOR CIN  -> SUM      <= FAGate3
  // VAL1 OR  VAL2 -> COUT     <= FAGate4

  const FAGate0s = input.gates
    .filter((gate) => gate.a.startsWith('x') || gate.b.startsWith('x'))
    .filter((gate: Gate) => gate.op === "XOR");

  FAGate0s.forEach((gate) => {
    const { a, b, output } = gate;

    const isFirst = a === "x00" || b === "x00";
    if (isFirst && output !== "z00") {
      flags.add(output);
    }
    if (!isFirst && output == "z00") {
      flags.add(output);
    }

    if (isFirst) return

    if (gate.output.startsWith("z")) {
      flags.add(output);
    }
  })

  const FAGate3s = input.gates
    .filter((gate: Gate) => gate.op === "XOR")
    .filter((gate) => !(gate.a.startsWith('x') || gate.b.startsWith('x')))

  FAGate3s.forEach((gate) => {
    if (!gate.output.startsWith("z")) {
      flags.add(gate.output);
    }
  })


  input.gates
    .filter((gate) => gate.output.startsWith("z"))
    .forEach((gate) => {
      const isLast = gate.output === `z${inputBitCount}`;
      if (isLast && gate.op !== "OR") {
        flags.add(gate.output);
      }
      if (!isLast && gate.op !== "XOR") {
        flags.add(gate.output);
      }
    });

  let checkNext = FAGate0s
    .filter((gate) => !flags.has(gate.output))
    .filter((gate) => gate.output !== "z00")
    .filter((gateA) => !FAGate3s
      .some((gateB) => gateB.a === gateA.output || gateB.b === gateA.output))
    .reduce((acc, gate) => {
      acc.push(gate);
      flags.add(gate.output);
      return acc;
    }, [] as Gate[]);

  checkNext.forEach(({ a }) => {
    const match = FAGate3s.find((gate) => gate.output === `z${a.slice(1)}`)!;

    const toCheck = [match.a, match.b];

    const orMatches = input.gates
      .filter((gate: Gate) => gate.op === "OR")
      .filter((gate) => toCheck.includes(gate.output));

    const correctOutput = toCheck.find((output) => output !== orMatches[0].output);
    if (correctOutput) {
      flags.add(correctOutput);
    }
  })

  return [...flags]
    .sort((a, b) => a.localeCompare(b))
    .join(",");
}


export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
