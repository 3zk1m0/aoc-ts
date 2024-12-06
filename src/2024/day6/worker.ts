declare var self: Worker;

const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

let grid: string[][] = []
let guard: number[] = []

self.onmessage = (event: MessageEvent) => {
  if (event.data.cmd === 'setup') {
    guard = event.data.guard
    grid = event.data.grid
    self.postMessage('ready')
    return
  }
  let result = 0
  const chunks = event.data
  for (const [x, y] of chunks) {
    const guardPos = guard.slice()
    let dir = 0
    const visited = new Set()
    while (guardPos[0] < grid[0].length && guardPos[1] < grid.length && guardPos[0] >= 0 && guardPos[1] >= 0) {
      const key = guardPos.join(',') + ',' + dir
      if (visited.has(key)) {
        result++
        break
      }
      visited.add(key)
      const newPos = [guardPos[0] + DIRS[dir][0], guardPos[1] + DIRS[dir][1]]
      if (newPos[0] < 0 || newPos[1] < 0 || newPos[0] >= grid[0].length || newPos[1] >= grid.length) {
        break
      }
      if (grid[newPos[1]][newPos[0]] === '#' || (newPos[0] === x && newPos[1] === y)) {
        dir = (dir + 1) % 4
        continue
      }
      guardPos[0] += DIRS[dir][0]
      guardPos[1] += DIRS[dir][1]
    }
  }

  self.postMessage(result);
};
