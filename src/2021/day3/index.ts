import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => rawInput.split("\n")



const part1 = (input) => {

  const sum = input.reduce((r,row) => {
    [...row].forEach((x, i) => r[i] += parseInt(x))
    return r
  }, new Array(input[0].length).fill(0))

  const gamma = sum
    .map(x => x > input.length / 2 ? "1" : "0")
    .join("")
  const epsilon = sum
    .map(x => x < input.length / 2 ? "1" : "0")
    .join("")

  return parseInt(gamma, 2) * parseInt(epsilon, 2)
}

const getCounts = (data, pos) => {
  return data.reduce((r,row) => {
    r[row[pos]] += 1
    return r
  }, {"1":0, "0":0})
}

const part2 = (input) => {

  let oxygenData = input.map(x => x)
  let co2Data = input.map(x => x)
  
  let pos = 0
  while (oxygenData.length > 1) {
    const counts = getCounts(oxygenData, pos)
    const equal = counts["0"] === counts["1"]
    const common = counts["0"] < counts["1"] || equal ? "1" : "0"
    oxygenData = oxygenData.filter(x => x[pos] === common)
    pos += 1
  }

  pos = 0
  while (co2Data.length > 1) {
    const counts = getCounts(co2Data, pos)
    const equal = counts["0"] === counts["1"]
    const common = counts["0"] < counts["1"] || equal ? "0" : "1"
    co2Data = co2Data.filter(x => x[pos] === common)
    pos += 1
  }

  return parseInt(oxygenData, 2) * parseInt(co2Data, 2)
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}

// [6.44ms] Part One: 1458194
// [0.44ms] Part Two: 2829354