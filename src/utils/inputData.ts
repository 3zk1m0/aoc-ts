import { readFileSync, writeFileSync, existsSync } from 'fs'
import { AoCHelper } from 'aoc-helper'
import { resolve } from 'path'
import { Args } from './types'

export const readInput = async ({ day, year }: Args) => {
  const path = resolve(import.meta.dir, `../${year}/day${day}/input.txt`)
  if (existsSync(path)) {
    return readFileSync(path).toString()
  }
  const session = process.env.SESSION ?? ''
  const helper = new AoCHelper(session)
  console.log('Downloading input ...')
  const inputData = (await helper.getInput(day, year)).trim()
  writeFileSync(path, inputData)
  return inputData
}
