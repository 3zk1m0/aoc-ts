
const decimalPrecision = 2
const decimalReduction = 6
const decimalsTruncated = decimalReduction - decimalPrecision

export const log = (title: string, solution:any, time:number): void => {
  if (typeof solution === "undefined") {
    console.log('\x1b[0m\x1b[31m' + `[${time}ms]` + '\x1b[0m', title, "\x1b[0m\x1b[31mFailed\x1b[0m")
  } else {
    console.log('\x1b[0m\x1b[32m' + `[${time}ms]` + '\x1b[0m', title, solution)
  }
}

export const runPart = (title: string, part: Function) => {

  const tStart = process.hrtime.bigint()
  const solution = part()
  const tEnd = process.hrtime.bigint()

  const time = Number((tEnd - tStart) / BigInt(Math.pow(10, decimalsTruncated))) /
    Math.pow(10, decimalPrecision)

  log(title, solution, time)

}
