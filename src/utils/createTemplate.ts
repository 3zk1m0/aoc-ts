import { AoCHelper } from 'aoc-helper'
import { constants, writeFileSync } from 'fs'
import { mkdir, access, copyFile } from 'fs/promises'
import { resolve } from 'path'

const { F_OK } = constants

const createDirectory = async (args: any) => {
  const { day, year } = args
  await mkdir(`./src/${year}/day${day}`, { recursive: true })
}

const copyIndexTemplate = async (args: any) => {
  const { day, year } = args
  try {
    await access(`./src/${year}/day${day}/index.ts`, F_OK)
  } catch (error) {
    await copyFile(
      resolve(__dirname, `../templates/index.ts`),
      `./src/${year}/day${day}/index.ts`
    )
  }
}

export const initDay = async (args: any): Promise<void> => {
  await createDirectory(args)
  await copyIndexTemplate(args)
} 
