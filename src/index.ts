import { runDay } from './runDay'

import { Command } from 'commander'
const program = new Command()

program.version('0.0.1')

program
  .command('runDay')
  .option('--year <year>', 'Year to run', new Date().getFullYear().toString())
  .option('--day <day>', 'Day to run', new Date().getDate().toString())
  .action((options) => {
    const day = parseInt(options.day === 'default' ? new Date().getDate().toString() : options.day)
    const year = parseInt(options.year === 'default' ? new Date().getFullYear().toString() : options.year)
    if (isNaN(day) || day < 1 || day > 25) throw new Error('Invalid day')
    if (isNaN(year) || year < 2015 || year > new Date().getFullYear()) throw new Error('Invalid year')
    runDay({ day, year })
  })

program.parse()
