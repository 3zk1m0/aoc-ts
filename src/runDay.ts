import { initDay } from './utils'

interface Args {
  day: string
  year: string
}

export const runDay = async (args: Args) => {
  if (args.day === 'default') args.day = new Date().getDate().toString()
  if (args.year === 'default') args.year = new Date().getFullYear().toString()
  console.clear()
  await initDay(args)
  console.log(`Running day ${args.day} of ${args.year}`)
  require(`./${args.year}/day${args.day}`)
    .main(args)
    .catch((error: any) => {
      console.error('Error:')
      console.error(error)
    })
}
