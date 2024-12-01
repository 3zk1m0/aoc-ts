const DECIMAL_PRECISION = 2
const DECIMAL_REDUCTION = 6
const DECIMALS_TRUNCATED = DECIMAL_REDUCTION - DECIMAL_PRECISION

export function log(title: string, solution: any, time: number) {
  if (typeof solution === 'undefined') {
    console.log(
      '\x1b[0m\x1b[31m' + `[${time}ms]` + '\x1b[0m',
      title,
      '\x1b[0m\x1b[31mFailed\x1b[0m'
    )
  } else {
    console.log('\x1b[0m\x1b[32m' + `[${time}ms]` + '\x1b[0m', title, solution)
  }
}


export function runPart<T extends () => any>(title: string, part: T, skipValue = false): ReturnType<T> {
  const tStart = process.hrtime.bigint()
  const solution = part()
  const tEnd = process.hrtime.bigint()

  const time =
    Number((tEnd - tStart) / BigInt(Math.pow(10, DECIMALS_TRUNCATED))) /
    Math.pow(10, DECIMAL_PRECISION)

  log(title, !skipValue ? solution : "", time)

  return solution
}
