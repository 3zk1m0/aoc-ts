import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.trim().split("\n")

interface CheapestQueueItem {
  y: number
  x: number
  presses: string
}

type Keypads = 'direction' | 'number'

interface KeypadConfig {
  pad: string[]
  x: number
  y: number
}

const KEYPAD_CONFIGS: Record<Keypads, KeypadConfig> = {
  direction: {
    pad: [
      "X^A",
      "<v>",
    ],
    x: 2,
    y: 0,
  },
  number: {
    pad: [
      "789",
      "456",
      "123",
      "X0A"
    ],
    x: 2,
    y: 3,
  },
}

type ScoreFn = (keypad: Keypads, fromX: number, fromY: number, toX: number, toY: number, robots: number) => number

const cache = new Map<string, number>();

const calculateTotalPresses = (keypad: Keypads, presses: string, robots: number, scoreFn: ScoreFn, disableCache = false) => {
  if (robots === 1) return presses.length;

  const config = KEYPAD_CONFIGS[keypad];

  let count = 0;

  let curX = config.x;
  let curY = config.y;

  for (let i = 0; i < presses.length; i++) {
    for (let y = 0; y < config.pad.length; y++) {
      for (let x = 0; x < config.pad[y].length; x++) {
        if (config.pad[y][x] === presses[i]) {
          count += scoreFn(keypad, curX, curY, x, y, robots);
          curX = x;
          curY = y;
        }
      }
    }
  }

  return count;
}

const calculateStepPresses: ScoreFn = (keypad, fromX, fromY, toX, toY, robots) => {
  const key = `${keypad},${fromX},${fromY},${toX},${toY},${robots}`;
  const cached = cache.get(key);
  if (cached) return cached;

  let answer = Number.MAX_SAFE_INTEGER;
  const queue: CheapestQueueItem[] = [{ x: fromX, y: fromY, presses: "" }];

  while (queue.length > 0) {
    const { x: nx, y: ny, presses } = queue.shift()!

    if (nx === toX && ny === toY) {
      const result = calculateTotalPresses('direction', presses + "A", robots - 1, calculateStepPresses)
      answer = Math.min(answer, result);
      continue;
    }

    if (KEYPAD_CONFIGS[keypad].pad[ny][nx] === 'X') continue;

    if (ny < toY) {
      queue.push({ y: ny + 1, x: nx, presses: presses + "v" });
    }
    if (ny > toY) {
      queue.push({ y: ny - 1, x: nx, presses: presses + "^" });
    }
    if (nx < toX) {
      queue.push({ y: ny, x: nx + 1, presses: presses + ">" });
    }
    if (nx > toX) {
      queue.push({ y: ny, x: nx - 1, presses: presses + "<" });
    }
  }

  cache.set(key, answer);

  return answer;
}


const day = (input: Input, robots: number) => {
  return input
    .map((line) => calculateTotalPresses('number', line, robots + 1, calculateStepPresses, true) * parseInt(line, 10))
    .reduce((acc, cur) => acc + cur, 0)
}

/* Tests */

// test()

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => day(input, 3))
  runPart('Part Two:', () => day(input, 26))
}
