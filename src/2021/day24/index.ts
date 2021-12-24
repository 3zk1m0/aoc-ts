import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => rawInput
    .split('inp w\n')
    .slice(1)
    .map(block => {
      return block.split('\n')
      .map(row => [row, ...row.split(' ').slice(1).map(Number)])
    })

const part1 = (input) => {
  const maxModel = new Array(14).fill(0)
  const stack = []
  for (let [i, block] of Object.entries(input)) {
    if (block[3][0] === 'div z 1') {
      stack.push([i, block[14][2]])
    } else if (block[3][0] === 'div z 26') {
      let [j, x] = stack.pop()
      let diff = x + block[4][2]
      if (diff < 0) {
        [i, j, diff] = [j, i, -diff]
      }
      maxModel[i] = 9
      maxModel[j] = 9 - diff
    }
  }
  
  return maxModel.join('')
}

const part2 = (input) => {
  const minModel = new Array(14).fill(0)
  const stack = []
  for (let [i, block] of Object.entries(input)) {
    if (block[3][0] === 'div z 1') {
      stack.push([i, block[14][2]])
    } else if (block[3][0] === 'div z 26') {
      let [j, x] = stack.pop()
      let diff = x + block[4][2]
      if (diff < 0) {
        [i, j, diff] = [j, i, -diff]
      }
      minModel[i] = 1 + diff
      minModel[j] = 1
    }
  }

  return minModel.join('')
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}

 