import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => {
  const parts = rawInput.split('\n\n')
  const numbers = parts[0].split(',').map(x => parseInt(x), 10)
  const tables = parts
    .slice(1)
    .map(x => x
      .split('\n')
      .map(y => y
        .match(/\d+/g)
        .map(z => parseInt(z, 10))
        )
      )
  return {
    numbers,
    tables
  }
}

interface Input {
  numbers: number[]
  tables: number[][]
}

const checkForWinner = (data) => {
  let result = -1
  data.forEach((table, i) => {
    if (result !== -1) return
    const rows = table.filter(row => row.filter(x => x === "X").length === 5)

    const columns = table.filter((row,i, all) => all.map(x => x[i]).filter(x => x === "X").length === 5)

    if (rows.length + columns.length !== 0) {
      result = i
    }
  })

  return result
}

const part1 = (input:Input) => {
  let data = JSON.parse(JSON.stringify(input.tables))
  let numbers = JSON.parse(JSON.stringify(input.numbers))

  let result
  let number
  while (true) {
    number = numbers.shift()
    data = data.map(tables => tables.map(y => y.map(x => x === number ? "X" : x)))
    result = checkForWinner(data)
    if (result !== -1) {
      break
    }
  }

  const winner = data[result]
  const points = winner.reduce((r, row) => r+row.filter(num => num !== "X").reduce((rr, x) => rr+x,0),0)

  return points * number
}

const filterWinners = (data) => {
  while (true) {
    const result = checkForWinner(data)
    if (result !== -1) {
      if (data.length <= 1) {
        break
      }
      data.splice(result, 1)
    } else {
      break
    }
  }
  return data
}

const part2 = (input) => {
  let data = JSON.parse(JSON.stringify(input.tables))
  let numbers = JSON.parse(JSON.stringify(input.numbers))

  let result
  let number
  while (true) {
    number = numbers.shift()
    data = data.map(tables => tables.map(y => y.map(x => x === number ? "X" : x)))
    data = filterWinners(data)
    if (data.length <= 1) {
      result = checkForWinner(data)
      if (result !== -1) {
        break
      }
    }
  }

  const winner = data[0]
  const points = winner.reduce((r, row) => r+row.filter(num => num !== "X").reduce((rr, x) => rr+x,0),0)

  return points * number
}

/* Tests */

// test()

/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart("Part One:", () => part1(input))
  runPart("Part Two:", () => part2(input))
}

 