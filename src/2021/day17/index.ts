import { test, readInput, runPart } from '../../utils'

type Input = number[][]

const prepareInput = (rawInput: string): Input => {
  let tmp:any = [...rawInput.matchAll(/^target area: x=(.+?)\.\.(.+?), y=(.+?)\.\.(.+?)$/g)][0]
    .slice(1)
    .map(x => parseInt(x, 10))
  return [tmp.slice(0,2), tmp.slice(2,4)]
}

interface Vector {
  pos: [number,number],
  dir: [number,number],
}

const nextPos = (vector:Vector):Vector => {

  const pos:[number,number] = [...vector.pos]
  const dir:[number,number] = [...vector.dir]
  pos[0] += dir[0]
  pos[1] += dir[1]
  dir[0] -= Math.sign(dir[0])
  dir[1] -= 1

  return {
    pos, dir
  }
}

const checkIfInArea = (vector:Vector, input:Input) => {
  const xInArea = vector.pos[0] >= input[0][0] && vector.pos[0] <= input[0][1]
  const yInArea = vector.pos[1] >= input[1][0] && vector.pos[1] <= input[1][1]
  return xInArea && yInArea
}

const checkIfHits = (dir:[number,number], input:Input) => {

  let vector:Vector = {
    pos: [0,0],
    dir: [...dir]
  }

  let maxY =-Infinity

  while (vector.pos[1] > input[1][0] && vector.pos[0] <= input[0][1]) {
    maxY = Math.max(maxY, vector.pos[1])
    vector = nextPos(vector)
    if (checkIfInArea(vector, input)) {
      return {
        hit: true,
        maxY
      }
    }
  }

  return {
    hit: false,
    maxY
  }
}

const part1 = (input:Input) => {

  let result = -Infinity

  // for (let y = -10; y < 200; y++) {
    const y = Math.abs(input[1][1]-1)
    for (let x = 0; x < input[0][1]+5; x++) {
      const {hit, maxY} = checkIfHits([x,y], input)
      if (hit) {
        result = Math.max(result, maxY)
      }
    }
  // }

  return result
}

const part2 = (input:Input) => {

  const hits = new Set<string>()

  for (let y = input[1][0]; y < 200; y++) {
    for (let x = 0; x < input[0][1]+1; x++) {
      const {hit} = checkIfHits([x,y], input)
      if (hit) {
        hits.add([x,y].join())
      }
    }
  }

  return hits.size
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}

 