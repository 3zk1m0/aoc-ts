import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) => {
  const rows = rawInput.split('\n')
  const aRoom = [rows[2][3], rows[3][3]].map((x) => x.charCodeAt(0) - 64)
  const bRoom = [rows[2][5], rows[3][5]].map((x) => x.charCodeAt(0) - 64)
  const cRoom = [rows[2][7], rows[3][7]].map((x) => x.charCodeAt(0) - 64)
  const dRoom = [rows[2][9], rows[3][9]].map((x) => x.charCodeAt(0) - 64)

  return [aRoom, bRoom, cRoom, dRoom]
}

const checkifValidRoom = (room, spot) =>
  room.every((x) => x === spot || x === 0)

const checkIfOrganized = (cages) => {
  return cages.every((cage, i) => cage.every((cell) => cell === +i + 1))
}

const solve = (startRooms) => {
  let startHall = [0, 0, 0, 0, 0, 0, 0]
  let roomSize = startRooms[0].length
  let minEnergy = Infinity

  let cache = {}
  const moveState = (rooms, hall, usedEnergy) => {
    if (usedEnergy >= minEnergy) {
      return
    }

    if (checkIfOrganized(rooms)) {
      minEnergy = Math.min(minEnergy, usedEnergy)
      return
    }

    let key = rooms + '|' + hall
    if (cache[key]) {
      if (cache[key] <= usedEnergy) return
    }
    cache[key] = usedEnergy

    for (let i = 0; i < rooms.length; i++) {
      let openSpot = rooms[i].findIndex((x) => x != 0)
      if (openSpot == -1) {
        continue
      }
      let current = rooms[i][openSpot]
      if (current === i + 1 && checkifValidRoom(rooms[i], current)) {
        continue
      }

      let moved = openSpot

      for (let j = i + 1; j >= 0; j--) {
        if (hall[j] != 0) {
          break
        }
        moved = j != 0 ? moved + 2 : moved + 1

        const newRooms = JSON.parse(JSON.stringify(rooms))
        const newHall = [...hall]
        const newEnergy = usedEnergy + moved * 10 ** (current - 1)
        newHall[j] = newRooms[i][openSpot]
        newRooms[i][openSpot] = 0

        moveState(newRooms, newHall, newEnergy)
      }

      moved = openSpot
      for (let j = i + 2; j < hall.length; j++) {
        if (hall[j] != 0) {
          break
        }
        moved = j != hall.length - 1 ? moved + 2 : moved + 1

        const newRooms = JSON.parse(JSON.stringify(rooms))
        const newHall = [...hall]
        const newEnergy = usedEnergy + moved * 10 ** (current - 1)
        newHall[j] = newRooms[i][openSpot]
        newRooms[i][openSpot] = 0

        moveState(newRooms, newHall, newEnergy)
      }
    }

    hallLoop: for (let i = 0; i < hall.length; i++) {
      let current = hall[i]
      if (current == 0 || !checkifValidRoom(rooms[current - 1], current)) {
        continue
      }
      let moved = 2
      if (i < current) {
        for (let j = i + 1; j <= current; j++) {
          if (hall[j] != 0) {
            continue hallLoop
          }
          moved = j != 1 ? moved + 2 : moved + 1
        }
      }
      if (i > current + 1) {
        for (let j = i - 1; j >= current + 1; j--) {
          if (hall[j] != 0) {
            continue hallLoop
          }
          moved = j != hall.length - 2 ? moved + 2 : moved + 1
        }
      }

      let openSpot = rooms[current - 1].findIndex((x) => x != 0)
      openSpot = openSpot === -1 ? roomSize - 1 : openSpot - 1
      moved += openSpot

      const newRooms = JSON.parse(JSON.stringify(rooms))
      const newHall = [...hall]
      const newEnergy = usedEnergy + moved * 10 ** (current - 1)
      newRooms[current - 1][openSpot] = current
      newHall[i] = 0

      moveState(newRooms, newHall, newEnergy)
    }
    return minEnergy
  }

  return moveState(startRooms, startHall, 0)
}

const part1 = (input) => {
  return solve(input)
}

const part2 = (input) => {
  const data = [...input]
  data[0] = [data[0][0], 4, 4, data[0][1]]
  data[1] = [data[1][0], 3, 2, data[1][1]]
  data[2] = [data[2][0], 2, 1, data[2][1]]
  data[3] = [data[3][0], 1, 3, data[3][1]]

  return solve(data)
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}

// #############
// #...........#
// ###C#A#B#D###
//   #B#A#D#C#
//   #########

// #############
// #.........D.#
// ###C#A#B#.###
//   #B#A#D#C#
//   #########
