import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => {
  return [...rawInput.trim()].map(x => ("0000" + (parseInt(x, 16)).toString(2)).substr(-4)).join('')
}

interface Packet {
  version: number,
  id: number,
  data: Packet[] | number
  remaining: string,
}

const parseLitaral = (packet:string): Packet => {
  const version = parseInt(packet.slice(0,3), 2)
  const id = parseInt(packet.slice(3,6), 2)
  let subData = packet.slice(6)
  const res = []

  while (true) {
    const firstBit = subData.slice(0,1)
    res.push(subData.slice(1,5))
    subData = subData.slice(5)
    if (firstBit === "0") {
      break
    }
  }

  return {
    version,
    id,
    data: parseInt(res.join(''), 2),
    remaining: subData
  }
}

const parseWithLength = (packetStr:string) => {
  const version = parseInt(packetStr.slice(0,3), 2)
  const id = parseInt(packetStr.slice(3,6), 2)

  const subPacketData = parseInt(packetStr.slice(7, 7+11), 2)
  let tmpData = packetStr.slice(7+11)
  const subData = []
  while (subData.length < subPacketData) {
    const tmp = parsePacket(tmpData.slice(0))
    subData.push(tmp)
    tmpData = tmp.remaining
  }
  return {
    version,
    id,
    data: subData,
    remaining: tmpData
  }
}

const parseWithcount = (packetStr:string) => {
  const version = parseInt(packetStr.slice(0,3), 2)
  const id = parseInt(packetStr.slice(3,6), 2)

  const subPacketData = parseInt(packetStr.slice(7, 7+15), 2)
  let subData = packetStr.slice(7+15, 7+15+subPacketData)
  const res = []
  while (subData.length > 0) {
    let tes = parsePacket(subData)
    res.push(tes)
    subData = tes.remaining
  }
  return {
    version,
    id,
    data: res,
    remaining: packetStr.slice(7+15+subPacketData)
  }
}



const parsePacket = (packetStr:string): Packet => {

  const id = parseInt(packetStr.slice(3,6), 2)
  if (id === 4) {
    return parseLitaral(packetStr)
  }

  const lenghtType = parseInt(packetStr[6])
  if (lenghtType === 1) {
    return parseWithLength(packetStr)
  } else {
    return parseWithcount(packetStr)
  }
}

const countVersionSum = (data) => {

  if (data.id === 4) {
    return data.version
  }

  const dataVersionSum = data.data.reduce((r,x) => {
    const sum = countVersionSum(x)
    return r + sum 
  },0)

  return data.version + dataVersionSum
}

const part1 = (input) => {
  const packet = parsePacket(input)
  return countVersionSum(packet)
}

const operate = (packet) => {
  const id = packet.id
  if (id === 0) {
    return packet.data.reduce((r,x) => r+operate(x), 0)
  }
  if (id === 1) {
    return packet.data.reduce((r,x) => r*operate(x), 1)
  }
  if (id === 2) {
    return packet.data.reduce((r,x) => Math.min(r, operate(x)), Infinity)
  }
  if (id === 3) {
    return packet.data.reduce((r,x) => Math.max(r, operate(x)), -Infinity)
  }
  if (id === 4) {
    return packet.data
  }
  if (id === 5) {
    return operate(packet.data[0]) > operate(packet.data[1]) ? 1 : 0
  }
  if (id === 6) {
    return operate(packet.data[0]) < operate(packet.data[1]) ? 1 : 0
  }
  if (id === 7) {
    return operate(packet.data[0]) === operate(packet.data[1]) ? 1 : 0
  }
}

const part2 = (input) => {
  const packet = parsePacket(input)
  return operate(packet)
}

/* Tests */

test(part1(prepareInput("8A004A801A8002F478")), 16)
test(part1(prepareInput("620080001611562C8802118E34")), 12)
test(part1(prepareInput("C0015000016115A2E0802F182340")), 23)
test(part1(prepareInput("A0016C880162017C3686B18A3D4780")), 31)

test(part2(prepareInput("C200B40A82")), 3)
test(part2(prepareInput("04005AC33890")), 54)
test(part2(prepareInput("880086C3E88112")), 7)
test(part2(prepareInput("CE00C43D881120")), 9)
test(part2(prepareInput("D8005AC2A8F0")), 1)
test(part2(prepareInput("F600BC2D8F")), 0)
test(part2(prepareInput("9C005AC2F8F0")), 0)
test(part2(prepareInput("9C0141080250320F1802104A08")), 1)

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))

  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}

 