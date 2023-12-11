// Greatest Common Divisor
export const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)

// Least Common Multiple
export const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

export const manhattanDistance = (a: [number, number], b: [number, number]) => {
  const [x1, y1] = a
  const [x2, y2] = b
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}
