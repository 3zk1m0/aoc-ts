import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((x) => x.split(''))

const input: string[][] = prepareInput(readInput())

function countNeigboursA(x, y, z, map) {
  let count = 0
  for (let zd = z - 1; zd <= z + 1; zd++) {
    for (let yd = y - 1; yd <= y + 1; yd++) {
      for (let xd = x - 1; xd <= x + 1; xd++) {
        if (map[`${xd},${yd},${zd}`]) count++
      }
    }
  }
  return map[`${x},${y},${z}`] ? count - 1 : count
}

const part1 = () => {
  let qube = {}
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      qube[`${x},${y},0`] = input[y][x] === '#'
    }
  }
  let xd = [0, input.length]
  let yd = [0, input[0].length]
  let zd = [0, 1]
  for (let t = 0; t < 6; t++) {
    const newQube = {}
    xd = [xd[0] - 1, xd[1] + 1]
    yd = [yd[0] - 1, yd[1] + 1]
    zd = [zd[0] - 1, zd[1] + 1]

    for (let z = zd[0]; z < zd[1]; z++) {
      for (let y = yd[0]; y < yd[1]; y++) {
        for (let x = xd[0]; x < xd[1]; x++) {
          let neighbors = countNeigboursA(x, y, z, qube)
          if (neighbors === 3 || (neighbors === 2 && qube[`${x},${y},${z}`])) {
            newQube[`${x},${y},${z}`] = true
          }
        }
      }
    }

    qube = newQube
  }
  return Object.keys(qube).length
}

function countNeigboursB(x, y, z, w, map) {
  let count = 0
  for (let wd = w - 1; wd <= w + 1; wd++) {
    for (let zd = z - 1; zd <= z + 1; zd++) {
      for (let yd = y - 1; yd <= y + 1; yd++) {
        for (let xd = x - 1; xd <= x + 1; xd++) {
          if (map[`${xd},${yd},${zd},${wd}`]) count++
        }
      }
    }
  }
  return map[`${x},${y},${z},${w}`] ? count - 1 : count
}

const part2 = () => {
  let qube = {}
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      qube[`${x},${y},0,0`] = input[y][x] == '#'
    }
  }
  let xd = [0, input.length]
  let yd = [0, input[0].length]
  let zd = [0, 1]
  let wd = [0, 1]
  for (let t = 0; t < 6; t++) {
    const newQube = {}
    xd = [xd[0] - 1, xd[1] + 1]
    yd = [yd[0] - 1, yd[1] + 1]
    zd = [zd[0] - 1, zd[1] + 1]
    wd = [wd[0] - 1, wd[1] + 1]

    for (let w = xd[0]; w < xd[1]; w++) {
      for (let z = zd[0]; z < zd[1]; z++) {
        for (let y = yd[0]; y < yd[1]; y++) {
          for (let x = xd[0]; x < xd[1]; x++) {
            let neighbors = countNeigboursB(x, y, z, w, qube)
            if (
              neighbors == 3 ||
              (neighbors == 2 && qube[`${x},${y},${z},${w}`])
            ) {
              newQube[`${x},${y},${z},${w}`] = true
            }
          }
        }
      }
    }

    qube = newQube
  }
  return Object.keys(qube).length // 2332
}

/* Tests */

// test()

/* Results */

runPart('Part One:', part1)
runPart('Part Two:', part2)
