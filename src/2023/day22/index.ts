import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>

type Vector3 = [number, number, number]

type Node = { id: number; children: Record<number, Node>; parents: number[] }

const prepareInput = (rawInput: string) =>
  rawInput
    .split('\n')
    .map((l) => l.split('~').map((m) => m.split(',').map((n) => +n)))
    .map(([a, b]) => {
      let diff = 0
      let axis = 0
      a.forEach((_, i) => {
        const d = b[i] - a[i]
        if (d > diff) {
          diff = d
          axis = i
        }
      })
      const res = [[...a]]
      for (let i = 1; i <= diff; i++) {
        res.push(a.map((n, ii) => n + i * (axis === ii ? 1 : 0)))
      }
      return res as Vector3[]
    })

const getBounds = (bricks: Input) => {
  return bricks.reduce(
    ([maxX, maxY, maxZ], brick) => {
      return brick.reduce(
        ([x, y, z], block) => {
          return [
            Math.max(x, block[0]),
            Math.max(y, block[1]),
            Math.max(z, block[2]),
          ]
        },
        [maxX, maxY, maxZ]
      )
    },
    [0, 0, 0]
  )
}

const createGrid = (bricks: Input) => {
  const [maxX, maxY, maxZ] = getBounds(bricks)
  const grid: number[][][] = Array(maxX + 1)
    .fill(0)
    .map(() =>
      Array(maxY + 1)
        .fill(0)
        .map(() => Array(maxZ + 1).fill(0))
    )
  let i = 1
  for (const brick of bricks) {
    for (const block of brick) {
      const [x, y, z] = block
      grid[x][y][z] = i
    }
    i++
  }
  return grid
}

const getFallenBricks = (input: Input) => {
  const bricksCopy = structuredClone(input)

  while (true) {
    const grid = createGrid(bricksCopy)
    let settled = true
    bricksCopy.forEach((brick, i) => {
      for (const block of brick) {
        const [x, y, z] = block
        if (z === 1) return
        const brickId = grid[x][y][z - 1]
        if (brickId !== 0 && i !== brickId - 1) return
      }
      settled = false
      brick.forEach((block) => (block[2] -= 1))
    })
    if (settled) break
  }
  return bricksCopy
}

const getLinks = (bricks: Input, grid: number[][][], dir: number = 1) => {
  return bricks.reduce((acc, brick, i) => {
    acc[i + 1] = brick.reduce((brickAcc, block) => {
      const [x, y, z] = block
      const brickId = grid[x][y][z + dir]
      if (!brickId) return brickAcc
      if (brickId === i + 1) return brickAcc
      if (brickAcc.includes(brickId)) return brickAcc
      brickAcc.push(brickId)
      return brickAcc
    }, [] as number[])
    return acc
  }, [] as number[][])
}

const getGraphNodes = (supported: number[][], supports: number[][]) => {
  const graph: Record<number, Node> = {}
  supports.forEach((support, i) => {
    if (!support) return
    if (!graph[i]) graph[i] = { id: i, children: {}, parents: [] }
    for (const s of support) {
      if (!graph[s]) graph[s] = { id: s, children: {}, parents: [] }
      graph[i].children[s] = graph[s]
    }
  })

  const nodes = Object.values(graph)
  nodes.forEach((targetNode) => {
    targetNode.parents = []
    const queue = [targetNode]
    while (queue.length) {
      const node = queue.shift()!
      for (const child of Object.values(node.children)) {
        const isSupportedByTargetNode = supported[child.id].some(
          (e) => !targetNode.parents.includes(e) && targetNode.id !== e
        )
        if (isSupportedByTargetNode) continue
        const isAlreadySupported = targetNode.parents.includes(child.id)
        if (isAlreadySupported) continue
        targetNode.parents.push(child.id)
        queue.push(child)
      }
    }
  })
  return nodes
}

let globalNodes: Node[] = []

const part1 = (input: Input) => {
  const bricks = getFallenBricks(input)
  const grid = createGrid(bricks)
  const supports = getLinks(bricks, grid, 1)
  const supported = getLinks(bricks, grid, -1)
  globalNodes = getGraphNodes(supported, supports)
  return globalNodes.filter((node) => !node.parents.length).length
}

const part2 = (input: Input) => {
  return globalNodes.reduce((acc, node) => acc + node.parents.length, 0)
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
