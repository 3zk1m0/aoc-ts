import { test, readInput, runPart } from '../../utils'

interface Input {
  id: number
  beacons: number[][]
}

const prepareInput = (rawInput: string): Input[] => rawInput.split('\n\n').map(part => {
  const lines = part.split('\n')
  const beacons = lines.slice(1).map((l) => l.split(',').map(Number))
  const id = +lines[0].match(/\d+/g)[0]
  return {id, beacons}
})

interface Signal {
  id: number
  pos: [number,number,number]
  relatives: string[]
}

interface Scanner {
  id: number
  signals: Signal[]
  pos?: [number,number,number]
}

interface Intersection {
  here: Signal
  there: Signal
  intersection: string[]
}

const alignSignal = (signalA: Signal, signalB: Signal) => {
  const dx = Math.abs(signalA.pos[0] - signalB.pos[0])
  const dy = Math.abs(signalA.pos[1] - signalB.pos[1])
  const dz = Math.abs(signalA.pos[2] - signalB.pos[2])
  signalA.relatives[signalB.id] = signalB.relatives[signalA.id] = [
      Math.hypot(dx, dy, dz).toFixed(5),
      Math.min(dx, dy, dz),
      Math.max(dx, dy, dz)
  ].join(",")
}

const compareSignal = (signalA: Signal, signalB: Signal): Intersection => {
  const intersection = signalA.relatives.reduce((r, relative) => {
    const index = signalB.relatives.indexOf(relative)
    if (index > -1) {
      r.push([signalB.relatives[index], signalA.relatives.indexOf(relative), index])
    }
    return r
  }, [])
  return {
    there: signalA,
    here: signalB,
    intersection
  }
}

const initScanners = (input:Input[]): Scanner[] => {
  const scanners = input.map(({id, beacons}:Input): Scanner => ({
    id,
    signals: beacons.reduce<Signal[]>((r,[x,y,z],id) => {
      const newSignal:Signal = {
        id,
        pos: [x,y,z],
        relatives: []
      }
      r.forEach(signal => alignSignal(signal, newSignal))
      r.push(newSignal)
      return r
    },[])
  }))
  return alignScanners(scanners)
}

const alignScanner = (scannerA:Scanner, scannerB:Scanner, data:Intersection) => {
  for (let line of data.intersection) {

      const relativeHere = scannerA.signals[line[2]]
      const d0 = data.here.pos.map((_,i) => data.here.pos[i] - relativeHere.pos[i])

      const relativeThere = scannerB.signals[line[1]]
      const d1 = data.there.pos.map((_,i) => data.there.pos[i] - relativeThere.pos[i])

      let map = []
      for (let x of d1) {
        for (let y of d0) {
          let value = y === x ? 1 : 0
          value = y === -x ? -1 : value
          map.push(value)
        }
      }

      for (let signal of scannerB.signals) {
          const oldPos = [...signal.pos]
          signal.pos[0] = oldPos[0] * map[0] + oldPos[1] * map[3] + oldPos[2] * map[6]
          signal.pos[1] = oldPos[0] * map[1] + oldPos[1] * map[4] + oldPos[2] * map[7]
          signal.pos[2] = oldPos[0] * map[2] + oldPos[1] * map[5] + oldPos[2] * map[8]
      }

      scannerB.pos = [
        data.here.pos[0] - data.there.pos[0],
        data.here.pos[1] - data.there.pos[1],
        data.here.pos[2] - data.there.pos[2],
      ]
      for (let signal of scannerB.signals) {
          signal.pos[0] += scannerB.pos[0]
          signal.pos[1] += scannerB.pos[1]
          signal.pos[2] += scannerB.pos[2]
      }
      break
  }
}

const compareScanners = (scannerA: Scanner, scannerB: Scanner): Intersection =>  {
  for (let signalB of scannerB.signals) {
    for (let signalA of scannerA.signals) {
      const result = compareSignal(signalB,signalA)
      if (result.intersection.length >= 11) {
        return result
      }
    }
  }
}

const alignScanners = (scanners: Scanner[]): Scanner[] => {
  const locked = new Set([0])
  scanners[0].pos = [0,0,0]
  while (locked.size < scanners.length) {
    for (let scannerA of scanners) {
      for (let scannerB of scanners.slice(1)) {
        if (!locked.has(scannerA.id) || locked.has(scannerB.id)) {
          continue
        }
        let intersection = compareScanners(scannerA, scannerB)
        if (intersection) {
          alignScanner(scannerA, scannerB, intersection)
          locked.add(scannerB.id)
        }
      }
    }
  }
  return scanners
}


const part1 = (input: Input[]) => {
  
  const scanners = initScanners(input)

  const beacons = new Set()
  for (let scanner of scanners) {
    for (let signal of scanner.signals) {
      beacons.add(signal.pos.join(","))
    }
  }
  return beacons.size
}

const part2 = (input: Input[]) => {

  const scanners = initScanners(input)

  let max = 0
  for (let here of scanners) {
    for (let there of scanners) {
      max = Math.max(max, here.pos.reduce((r,x,i) => 
        r + Math.abs(here.pos[i] - there.pos[i])
      , 0))
    }
  }
  return max
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}

 