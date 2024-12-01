import { Args, initDay, readInput } from './utils'

export async function runDay(args: Args) {
  console.clear()
  await initDay(args)
  console.log(`Running day ${args.day} of ${args.year}`)
  const input = await readInput(args)
  require(`./${args.year}/day${args.day}`)
    .main(input)
    .catch((error: any) => {
      console.error('Error:')
      console.error(error)
    })
}
