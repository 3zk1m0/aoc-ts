import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => {
  const [mapStr, movesStr] = rawInput.trim().split('\n\n')
  const map = mapStr.trim().split('\n').map(row => row.split(''))
  const moves = movesStr.trim().split('\n').join('').split('') as Direction[]
  return { map, moves }
}

type Direction = "v" | "^" | "<" | ">"
type Vector = [number, number]

const DIRS: Record<Direction, Vector> = {
  "^": [0, -1],
  "v": [0, 1],
  "<": [-1, 0],
  ">": [1, 0],
}


interface Entity {
  id?: number
  x: number
  y: number
  width: number
}

const doesCollide = (a: Entity, b: Entity) => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y <= b.y &&
    a.y >= b.y
  );
}  

const day = (input: Input, part2 = false) => {

  let playerPos: Entity = { x: 0, y: 0, width: 1 };
  const boxes: Entity[] = [];
  let walls: Entity[] = [];

  const p2 = part2 ? 2 : 1;
  const entityWidth = p2

  for (let y = 0; y < input.map.length; y++) {
    for (let x = 0; x < input.map[y].length; x++) {
      if (input.map[y][x] === "@") {
        playerPos = { x: x * p2, y, width: 1 };
      }
      if (input.map[y][x] === "O") {    
        boxes.push({ x: x * p2, y, width: entityWidth, id: boxes.length });
      }
      if (input.map[y][x] === "#") {
        walls.push({ x: x * p2, y, width: entityWidth });
      }
    }
  }

  for (const mov of input.moves) {
    const [dx, dy] = DIRS[mov];
    const newPosition: Entity = {
      x: playerPos.x + dx,
      y: playerPos.y + dy,
      width: 1
    }

    let doesWallsCollide = walls.some((wall) => doesCollide(wall, newPosition));
    if (doesWallsCollide) {
      continue;
    }

    const collidedBox = boxes.find((box) => doesCollide(box, newPosition));
    if (!collidedBox) {
      playerPos = newPosition;
      continue;
    }

    let stack: Entity[] = [];
    let toMove: Entity[] = [];

    let canMove = true;

    stack.push({
      ...collidedBox,
      x: collidedBox.x + dx,
      y: collidedBox.y + dy,
    })

    while (stack.length > 0) {
      const entity = stack.pop()!;

      let doesCollideWall = walls.some((wall) => doesCollide(wall, entity));
      if (doesCollideWall) {
        canMove = false;
        break;
      }

      let collidingBoxes = boxes.filter((box) => box.id !== entity.id && doesCollide(box, entity));
      for (const box of collidingBoxes) {
        stack.push({
          ...box,
          x: box.x + dx,
          y: box.y + dy,
        })
      }

      toMove.push(entity);
    }

    if (canMove) {
      playerPos = newPosition;
      for (const final of toMove) {
        boxes[final.id!] = final;
      }
    }
  }

  return boxes.reduce((acc, box) => acc + box.x + (box.y * 100), 0)
}

/* Tests */

// test()

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => day(input))
  runPart('Part Two:', () => day(input, true))
}
