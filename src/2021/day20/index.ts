import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => {
  const parts = rawInput.split('\n\n')
  const alg = parts[0].split('').map((char) => +(char === '#'))
  const img = parts[1].split('\n').map((row) => row.split('').map((char) => +(char === '#')))
  return {
    alg, img
  }
}

const DIR = [
  [-1,-1], [0,-1], [1,-1],
  [-1, 0], [0, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
]

const part = (input, times) => {
  let {alg, img} = input

  for (let t = 0; t < times; t++) {
    const newImg = [];
    for (let y = -1; y < img.length + 1; y++) {
      const newRow = [];
      for (let x = -1; x < img.length + 1; x++) {
        const binary = DIR.reduce((r,dir) => {
          const dx = x + dir[0]
          const dy = y + dir[1]
          return r + `${img[dy]?.[dx] ?? alg[0] & t % 2}`
        }, '')
        newRow.push(alg[parseInt(binary, 2)]);
      }
      newImg.push(newRow);
    }
    img = newImg;
  }
  return img.flat().filter(Boolean).length
}


/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const str = await readInput(args)
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part(input, 2))
  runPart("Part Two:", () => part(input, 50))
}

// NOPE 5513