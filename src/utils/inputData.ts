import { readFileSync, writeFileSync, existsSync } from 'fs'
import { AoCHelper } from 'aoc-helper'
import { resolve } from 'path'

export const readInput = async (args: any) => {
  const { day, year } = args
  const path = resolve(__dirname, `../${year}/day${day}/input.txt`)
  try {
    if (existsSync(path)) {
      return readFileSync(path).toString()
    }
    const { day, year } = args
    const session = process.env.SESSION || ''
    const helper = new AoCHelper(session)
    console.log('Downloading input ...')
    const inputData = (await helper.getInput(day, year)).trim()
    writeFileSync(path, inputData)
    return inputData
  } catch (error) {
    console.error(error)
  }
}
