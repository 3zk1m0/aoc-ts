import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.split(',')

const hash = (str: string) => {
  let value = 0
  for (let i = 0; i < str.length; i++) {
    value += str.charCodeAt(i)
    value *= 17
    value = value % 256
  }
  return value
}

const part1 = (input: Input) => {
  return input.reduce((acc, curr) => acc + hash(curr), 0)
}

type Lense = [string, string]

const part2 = (input: Input) => {
  const boxes: Lense[][] = new Array(256).fill(0).map(() => [])

  for (let cmd of input) {
    const [_, label, operation, value] = cmd.match(/(\w+)([=-])(\d*)/)!
    const boxId = hash(label)

    if (operation === '=') {
      const existing = boxes[boxId].findIndex(([l]) => l === label)
      if (existing !== -1) {
        boxes[boxId][existing][1] = value
      } else {
        boxes[boxId].push([label, value])
      }
    }

    if (operation === '-') {
      boxes[boxId] = boxes[boxId].filter(([l]) => l !== label)
    }
  }

  return boxes.reduce((total, box, boxIndex) => {
    return (
      total +
      box.reduce((lenseTotal, [_, lense], lenseIndex) => {
        return lenseTotal + (boxIndex + 1) * ((lenseIndex + 1) * Number(lense))
      }, 0)
    )
  }, 0)
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
