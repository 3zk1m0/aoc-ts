// Greatest Common Divisor
export const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)

// Least Common Multiple
export const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

export const manhattanDistance = (a: [number, number], b: [number, number]) => {
  const [x1, y1] = a
  const [x2, y2] = b
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

export const transpose2d = <T>(grid: T[][]): T[][] => {
  const columns: T[][] = []
  for (let x = 0; x < grid[0].length; x++) {
    columns.push(grid.map((row) => row[x]))
  }
  return columns
}

export const getDiffCount = (a: string[], b: string[]) => {
  return a.filter((x, i) => x !== b[i]).length
}

export const inRange2d = (pos: [number, number], arr: any[][]) => {
  return (
    pos[0] >= 0 && pos[0] < arr.length && pos[1] >= 0 && pos[1] < arr[0].length
  )
}
