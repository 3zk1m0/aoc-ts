import { constants, writeFileSync } from 'fs'
import { mkdir, access, copyFile } from 'fs/promises'
import { resolve } from 'path'
import { Args } from '.'

const { F_OK } = constants

const createDirectory = async ({ day, year }: Args) => {
  await mkdir(`./src/${year}/day${day}`, { recursive: true })
}

const copyIndexTemplate = async ({ day, year }: Args) => {
  try {
    await access(`./src/${year}/day${day}/index.ts`, F_OK)
  } catch (error) {
    await copyFile(
      resolve(import.meta.dir, `../templates/index.ts`),
      `./src/${year}/day${day}/index.ts`
    )
  }
}

export const initDay = async (args: Args): Promise<void> => {
  await createDirectory(args)
  await copyIndexTemplate(args)
}
