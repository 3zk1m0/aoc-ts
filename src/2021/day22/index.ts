import { test, readInput, runPart } from '../../utils'

interface Cube {
  state: boolean
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  zMin: number
  zMax: number
}

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((row) => {
    const [state, posStr] = row.split(' ')
    const pos = posStr.match(/[-\d]+/g).map(Number)

    return {
      state: state === 'on',
      xMin: pos[0],
      xMax: pos[1],
      yMin: pos[2],
      yMax: pos[3],
      zMin: pos[4],
      zMax: pos[5],
    }
  })

const getArea = (row: Cube) => {
  const x = Math.abs(row.xMax - row.xMin) + 1
  const y = Math.abs(row.yMax - row.yMin) + 1
  const z = Math.abs(row.zMax - row.zMin) + 1
  return x * y * z
}

const isOverlapping = (cubeA: Cube, cubeB: Cube) => {
  const xOverlap = cubeA.xMin <= cubeB.xMax && cubeB.xMin <= cubeA.xMax
  const yOverlap = cubeA.yMin <= cubeB.yMax && cubeB.yMin <= cubeA.yMax
  const zOverlap = cubeA.zMin <= cubeB.zMax && cubeB.zMin <= cubeA.zMax
  return xOverlap && yOverlap && zOverlap
}

type NPair = [number, number]
const createCube = (x: NPair, y: NPair, z: NPair) => ({
  state: true,
  xMin: x[0],
  xMax: x[1],
  yMin: y[0],
  yMax: y[1],
  zMin: z[0],
  zMax: z[1],
})

const splitCubes = (ogCube: Cube, cutCube: Cube) => {
  let cutCubes = []
  if (cutCube.xMin > ogCube.xMin) {
    cutCubes.push(
      createCube(
        [ogCube.xMin, cutCube.xMin - 1],
        [ogCube.yMin, ogCube.yMax],
        [ogCube.zMin, ogCube.zMax]
      )
    )
  }
  if (cutCube.xMax < ogCube.xMax) {
    cutCubes.push(
      createCube(
        [cutCube.xMax + 1, ogCube.xMax],
        [ogCube.yMin, ogCube.yMax],
        [ogCube.zMin, ogCube.zMax]
      )
    )
  }

  let middleXRange: NPair = [
    Math.max(ogCube.xMin, cutCube.xMin),
    Math.min(ogCube.xMax, cutCube.xMax),
  ]
  if (cutCube.yMin > ogCube.yMin) {
    cutCubes.push(
      createCube(
        middleXRange,
        [ogCube.yMin, cutCube.yMin - 1],
        [ogCube.zMin, ogCube.zMax]
      )
    )
  }
  if (cutCube.yMax < ogCube.yMax) {
    cutCubes.push(
      createCube(
        middleXRange,
        [cutCube.yMax + 1, ogCube.yMax],
        [ogCube.zMin, ogCube.zMax]
      )
    )
  }

  let middleYRange: NPair = [
    Math.max(ogCube.yMin, cutCube.yMin),
    Math.min(ogCube.yMax, cutCube.yMax),
  ]
  if (cutCube.zMin > ogCube.zMin) {
    cutCubes.push(
      createCube(middleXRange, middleYRange, [ogCube.zMin, cutCube.zMin - 1])
    )
  }
  if (cutCube.zMax < ogCube.zMax) {
    cutCubes.push(
      createCube(middleXRange, middleYRange, [cutCube.zMax + 1, ogCube.zMax])
    )
  }

  return cutCubes
}

const run = (rows: Cube[]) => {
  let litCubes = []

  for (let newCube of rows) {
    let newCubes = []
    for (let oldCube of litCubes) {
      if (isOverlapping(oldCube, newCube)) {
        let cutCuboids = splitCubes(oldCube, newCube)
        newCubes.push(...cutCuboids)
      } else {
        newCubes.push(oldCube)
      }
    }
    if (newCube.state) {
      newCubes.push(newCube)
    }
    litCubes = newCubes
  }

  return litCubes.reduce((sum, curr) => sum + getArea(curr), 0)
}

const part1 = (input) => {
  const data = input.filter((step) => {
    const x = ![step.xMax, step.xMin].some((el) => Math.abs(el) > 50)
    const y = ![step.xMax, step.xMin].some((el) => Math.abs(el) > 50)
    const z = ![step.xMax, step.xMin].some((el) => Math.abs(el) > 50)
    return x && y && z
  })

  return run(data)
}

const part2 = (input: Cube[]) => {
  return run(input)
}

/* Tests */

// test()

/* Results */

export async function main(args: string) {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
