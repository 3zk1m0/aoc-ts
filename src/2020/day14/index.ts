import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) => rawInput.split('\n')

const input = prepareInput(readInput())

const part1 = () => {
  const memory = {}
  let mask
  for (const line of input) {
    const parts = line.split(' = ')
    if (parts[0] == "mask") {
      mask = parts[1]
    } else {
      const bin = (parseInt(parts[1]) >>> 0).toString(2).padStart(36,'0')
      let result = ""
      for (let i = 0; i < bin.length; i++) {
        if (mask[i] != "X")
          result += mask[i]
        else
          result += bin[i]
      }
      memory[parts[0]] = parseInt(result,2)
    }
  }
  return  Object.values<number>(memory).reduce((x:number,y:number) => x+y, 0)
}

const getAddresses = (address:string):string[] => {
  const index = address.indexOf("X")
  if (index == -1) return [address]
  const part1 = getAddresses(address.substr(0, index) + "1" + address.substr(index+1))
  const part2 = getAddresses(address.substr(0, index) + "0" + address.substr(index+1))
  return part1.concat(part2)
}

const part2 = () => {
  const memory = {}
  let mask
  for (const line of input) {
    const parts = line.split(' = ')
    if (parts[0] == "mask") {
      mask = parts[1]
    } else {
      const address = (parseInt(parts[0].slice(4,-1)) >>> 0).toString(2).padStart(36,'0')
      let result = ""
      for (let i = 0; i < address.length; i++) {
        if (mask[i] == "0")
          result += address[i]
        else
          result += mask[i]
      }
      getAddresses(result).forEach(x => {
        memory[parseInt(x,2)] = parseInt(parts[1])
      })

    }
  }
  return  Object.values<number>(memory).reduce((x:number,y:number) => x+y,0)
}

/* Tests */

// test()

/* Results */

runPart("Part One:", part1)
runPart("Part Two:", part2)
