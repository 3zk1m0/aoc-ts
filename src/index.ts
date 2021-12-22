
import { runDay } from './runDay'

import { Command } from 'commander';
const program = new Command();

program.version('0.0.1')

program
  .command('runDay')
  .option('--year <year>', "Year to run", new Date().getFullYear().toString())
  .option('--day <day>', "Day to run", new Date().getDate().toString())
  .action((options) => {
    runDay({day: options.day, year: options.year})
  });


program.parse();


