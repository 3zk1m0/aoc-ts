
// Greatest Common Divisor
export const gcd = (a, b) => a ? gcd(b % a, a) : b;

// Least Common Multiple
export const lcm = (a, b) => a * b / gcd(a, b);