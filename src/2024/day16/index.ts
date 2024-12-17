import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => {
  const map = rawInput.trim().split('\n').map(l => l.split(""))
  let start: Vector = [0, 0]
  let end: Vector = [0, 0]
  map.forEach((line, y) => line.forEach((char, x) => {
    if (char === "S") {
      start = [y, x]
    }
    if (char === "E") {
      end = [y, x]
    }
  }))
  return {
    map,
    start,
    end
  }
}

type Vector = [number, number]

const DIRS: Vector[] = [
  [0, 1], [1, 0], [0, -1], [-1, 0]
]

interface Track {
  score: number;
  dirIndex: number;
  path: Vector[];
}

const allTracks: Track[] = [];
let answer1 = Number.MAX_SAFE_INTEGER;

const part1 = ({ start, end, map }: Input) => {

  const visited = new Map<string, number>();
  let tracks: Track[] = [{ score: 0, dirIndex: 0, path: [start] }];

  while (tracks.length > 0) {
    const trackStack: Track[] = [];
    for (const { score, dirIndex, path: path } of tracks.sort((a, b) => a.score - b.score)) {
      const [x, y] = path.at(-1)!;
      const possibleDirs = [
        dirIndex, (dirIndex + 1) % 4, (dirIndex + 3) % 4
      ]

      for (const newDirIndex of possibleDirs) {
        const [dx, dy] = DIRS[newDirIndex]
        const nx = x + dx;
        const ny = y + dy;

        const value = map[nx]?.[ny];
        if (!value || value === "#") continue;

        const didDirChange = dirIndex !== newDirIndex;

        const newTrack: Track = {
          score: score + (didDirChange ? 1001 : 1),
          dirIndex: newDirIndex,
          path: [...path, [nx, ny]]
        }

        const visitKey = `${nx},${ny},${newDirIndex}`;
        const oldScore = visited.get(visitKey);
        if (oldScore && oldScore < newTrack.score) {
          continue;
        }
        visited.set(visitKey, newTrack.score);
        if (nx === end[0] && ny === end[1]) {
          allTracks.push(newTrack);
        } else {
          trackStack.push(newTrack);
        }
      }
    }
    tracks = trackStack;
  }

  answer1 = Math.min(
    ...DIRS.map((_, i) =>
      visited.get(`${end[0]},${end[1]},${i}`) || Number.MAX_SAFE_INTEGER
    )
  );

  return answer1
}

const part2 = () => {
  const bestTiles = new Set<string>();
  allTracks
    .filter(({ score }) => score === answer1)
    .forEach(({ path }) => path.forEach(([x, y]) => bestTiles.add(`${x},${y}`)));

  return bestTiles.size;
}

/* Tests */

// test()

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2()) // Depends on part1 result
}
