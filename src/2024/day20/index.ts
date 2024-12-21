import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.trim().split('\n').map(line => line.split(''))

type Vector = {
  x: number,
  y: number,
}

const DIRS: Vector[] = [
  {x: 0, y: 1},
  {x: 1, y: 0},
  {x: 0, y: -1},
  {x: -1, y: 0},
];

const part1 = (input: Input) => {

  let start: Vector = {x: 0, y: 0}

  const walls: Vector[] = []

  for (let y = 1; y < input.length-1; y++) {
    for (let x = 1; x < input[y].length-1; x++) {
      const value = input[y][x]
      if (value === "S") start = {x,y}
      if (value === "#") walls.push({x,y})
    }
  }

  const track = new Map<string, number>()

  const queue = [{pos: start, dist: 0}]
  while (queue.length > 0) {
    const {pos: {x, y}, dist} = queue.pop()!
    const key = `${x},${y}`

    const value = input[y][x]
    if (value === "#") continue

    if (track.has(key)) continue
    track.set(key, dist)

    for (const dir of DIRS) {
      queue.push({
        pos: {x: x+dir.x, y: y+dir.y},
        dist: dist+1,
      })
    }
  }

  const passableWalls = walls.flatMap(({x,y}) => {
    const top = track.get(`${x},${y-1}`)
    const bottom = track.get(`${x},${y+1}`)
    const left = track.get(`${x-1},${y}`)
    const right = track.get(`${x+1},${y}`)

    const res = []

    if (left != undefined && right != undefined) {
      res.push(Math.abs(left - right) - 2)
    }
    if (top != undefined && bottom != undefined) {
      res.push(Math.abs(top - bottom) - 2)
    }
    return res

  }).filter(x => !!x).reduce((acc, wall) => {
    acc.set(wall!, (acc.get(wall!) ?? 0) + 1)
    return acc
  }, new Map<number,number>);

  return [...passableWalls.entries()]
    .filter(([key,_]) => key >= 100)
    .reduce((acc, [_,value]) => acc + value, 0)

}

const manhattanDistance = (a: Vector, b: Vector) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

const part2 = (input: Input) => {
  
  let start: Vector = {x: 0, y: 0}

  for (let y = 1; y < input.length-1; y++) {
    for (let x = 1; x < input[y].length-1; x++) {
      const value = input[y][x]
      if (value === "S") start = { x, y }
    }
  }

  const path: {x: number, y: number}[] = [];
  const visited = new Set();
  const queue = [start];

  while (queue.length > 0) {
    const pos = queue.pop()!
    visited.add(`${pos.x},${pos.y}`)
    path.push(pos)

    for (const dir of DIRS) {
      const newPos = {x: pos.x+dir.x, y: pos.y+dir.y}
      if (input[newPos.y][newPos.x] === "#") continue
      if (visited.has(`${newPos.x},${newPos.y}`)) continue
      queue.push(newPos)
      break
    }
  }

  let cheats = 0;

  for (let pos1 = 0; pos1 < path.length - 1; pos1++) {
    for (let pos2 = pos1 + 100; pos2 < path.length; pos2++) {
      const dist = manhattanDistance(path[pos1], path[pos2])
      if (dist > 20) continue
      const saved = pos2 - pos1 - dist;
      if (saved >= 100) cheats++;
    }
  }

  return cheats;
}


/* Tests */

// test()

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
