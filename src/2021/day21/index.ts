import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) =>
  rawInput.match(/: \d+/g).map((x) => parseInt(x.slice(2), 10))

const part1 = (input) => {
  const playersPos: number[] = input.slice()
  const playersScore: number[] = input.slice().fill(0)

  let dice = 1
  while (playersScore.every((x) => x < 1000)) {
    for (let i in playersPos) {
      for (let x = 0; x < 3; x++) {
        playersPos[i] = ((playersPos[i] + dice - 1) % 10) + 1
        dice++
      }
      playersScore[i] = playersScore[i] + playersPos[i]
      if (playersScore[i] >= 1000) {
        break
      }
    }
  }

  return (dice - 1) * playersScore.sort()[1]
}

const DICE = { 3: 1, 4: 3, 5: 6, 6: 7, 7: 6, 8: 3, 9: 1 }

const part2 = (input) => {
  const wins = [0, 0]
  let universe: Record<string, number> = {}
  universe[JSON.stringify([0, 0, ...input])] = 1

  while (Object.values(universe).length) {
    let newUnivese: Record<string, number> = {}
    for (let [stateJSON, count] of Object.entries(universe)) {
      let [score1, score2, pos1, pos2] = JSON.parse(stateJSON)

      for (let [d1, d1count] of Object.entries(DICE)) {
        let p1 = ((pos1 + +d1 - 1) % 10) + 1
        let s1 = score1 + p1
        if (s1 >= 21) {
          wins[0] += +count * d1count
          continue
        }
        for (let [d2, d2count] of Object.entries(DICE)) {
          let p2 = ((pos2 + +d2 - 1) % 10) + 1
          let s2 = score2 + p2
          if (s2 >= 21) {
            wins[1] += +count * d2count
            continue
          }
          const key = JSON.stringify([s1, s2, p1, p2])
          newUnivese[key] = (newUnivese[key] || 0) + count * d1count * d2count
        }
      }
    }
    universe = newUnivese
  }

  return Math.max(...wins)
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
