import { floor, re } from 'mathjs'
import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => {
  return {
    regA: Number(rawInput.match(/Register A: (\d+)/)![1]),
    regB: Number(rawInput.match(/Register B: (\d+)/)![1]),
    regC: Number(rawInput.match(/Register C: (\d+)/)![1]),
    program: rawInput.match(/Program: ([\d,]+)/)![1].split(',').map(Number)
  }
}

const part1 = (input: Input, part2 = false) => {
  
  const program = input.program
  let regA = input.regA
  let regB = input.regB
  let regC = input.regC


  const combo = (operand: number) => [0, 1, 2, 3, regA, regB, regC][operand];


  let pointer = 0

  const output: number[] = []

  const instructions: ((operand: number) => void)[] = [
    (operand) => regA = Math.floor(regA / (2 ** combo(operand))),
    (operand) => regB = regB ^ operand,
    (operand) => regB = ((combo(operand) % 8) + 8) % 8,
    (operand) => regA && (pointer = operand - 2),
    () => (regB = regB ^ regC),
    (operand) => output.push(((combo(operand) % 8) + 8) % 8),
    (operand) => regB = Math.floor(regA / (2 ** combo(operand))),
    (operand) => regC = Math.floor(regA / (2 ** combo(operand))),
  ];

  while (pointer < program.length) {
    instructions[program[pointer]](program[pointer+1]);
    pointer += 2;
  }

  if (part2) return output

  return output.join(',')
}


interface StackItem {
  regA: number;
  programIndex: number;
}

const part2 = (input: Input) => {
  const program = input.program;
  let stack: StackItem[] = [{ regA: 0, programIndex: program.length - 1 }];

  while (stack.length > 0) {
    const { regA: nextVal, programIndex } = stack.pop()!;
    if (programIndex < 0) return nextVal;

    for (let aVal = nextVal * 8 + 7; aVal >= nextVal * 8; aVal--) {
      const out = part1({ ...input, regA: aVal }, true);
      if (out[0] === program[programIndex]) {
        stack.push({ regA: aVal, programIndex: programIndex - 1 });
      }
    }
  }
};

/* Tests */

const testInput1 = prepareInput(`\
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`)

const testInput2 = prepareInput(`\
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`)

test(part1(testInput1), "4,6,3,5,6,3,5,2,1,0")
test(part2(testInput2), 117440)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
