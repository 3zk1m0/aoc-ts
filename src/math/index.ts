// Greatest Common Divisor
export const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b)

// Least Common Multiple
export const lcm = (a: number, b: number) => (a * b) / gcd(a, b)
