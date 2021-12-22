#!/usr/bin/env node

import { initDay } from "./utils"

export const runDay = async (args:any) => {
  await initDay(args)
  require(`./${args.year}/day${args.day}`)
    .main(args)
    .catch((error) => {
      console.error("Error:")
      console.error(error)
    })
}
