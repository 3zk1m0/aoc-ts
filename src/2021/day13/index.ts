import { test, readInput, runPart } from '../../utils'

type Paper = Set<string>
type Fold = {
  axel: string
  pos: number
}

interface Input {
  paper: Paper
  folds: Fold[]
}

const prepareInput = (rawInput: string) => {
  const [coordinates, folds] = rawInput.split('\n\n')
  const paper = new Set<string>()

  coordinates.split('\n').forEach((row) => {
    paper.add(row)
  })

  return {
    paper,
    folds: folds
      .split('\n')
      .map((row) => row.match(/[xy]=\d+/g))
      .map((x) => x[0].split('='))
      .map((x) => ({ axel: x[0], pos: parseInt(x[1]) })),
  }
}

const foldPaper = (paper: Paper, fold: Fold) => {
  const newSet = new Set<string>()
  paper.forEach((item) => {
    const [x, y] = item.split(',').map((val) => parseInt(val, 10))
    const pos = { x, y }
    if (pos[fold.axel] < fold.pos) {
      newSet.add(item)
    }
    if (fold.axel === 'y' && y > fold.pos) {
      newSet.add([x, fold.pos - (y - fold.pos)].toString())
    }
    if (fold.axel === 'x' && x > fold.pos) {
      newSet.add([fold.pos - (x - fold.pos), y].toString())
    }
  })

  return newSet
}

const drawPaper = (paper: Paper) => {
  let result = '\n'
  let [x1, y1, x2, y2] = [Infinity, Infinity, 0, 0]

  paper.forEach((row) => {
    const [x, y] = row.split(',').map((z) => parseInt(z, 10))
    x1 = Math.min(x, x1)
    x2 = Math.max(x, x2)
    y1 = Math.min(y, y1)
    y2 = Math.max(y, y2)
  })

  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      result += paper.has([x, y].toString()) ? '#' : ' '
    }
    result += '\n'
  }
  return result
}

const part1 = (input: Input) => {
  let paper = new Set<string>(input.paper)
  paper = foldPaper(paper, input.folds[0])
  return paper.size
}

const part2 = (input: Input) => {
  let paper = new Set<string>(input.paper)
  for (let fold of input.folds) {
    paper = foldPaper(paper, fold)
  }
  return drawPaper(paper)
}

/* Tests */

// test()

/* Results */

export async function main(args: string) {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
