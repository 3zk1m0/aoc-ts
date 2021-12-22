import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) => {
  const passports = rawInput.split('\n\n').map(x => {
    const rows = x.split('\n')
    const fields = rows.map(x => x.split(' '))
    return fields.flat().map(x => x.split(':'))
  })
  return passports
}

const required = [
  'byr',
  'iyr',
  'eyr', 
  'hgt',
  'hcl', 
  'ecl',
  'pid', 
  // 'cid', ignored
]

const input = prepareInput(readInput())

const part1 = () => {

  const data:string[][] = JSON.parse(JSON.stringify(input))

  const result = data.filter(x => {
    const keys = x.map(y => y[0])
    for (const y of required) {
      if (!keys.includes(y)) return false
    };
    return true
  })

  return result.length
}

// byr (Birth Year) - four digits; at least 1920 and at most 2002.
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
// hgt (Height) - a number followed by either cm or in:
// If cm, the number must be at least 150 and at most 193.
// If in, the number must be at least 59 and at most 76.
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
// pid (Passport ID) - a nine-digit number, including leading zeroes.
// cid (Country ID) - ignored, missing or not.

const validation = {
  byr: x => (1920 <= parseInt(x) && parseInt(x) <= 2002),
  iyr: x => (2010 <= parseInt(x) && parseInt(x) <= 2020),
  eyr: x => (2020 <= parseInt(x) && parseInt(x) <= 2030),
  hgt: x => {
    const val = parseInt(x.slice(0,-2))
    if (x.slice(-2) == 'cm') return (150 <= val && val <= 193)
    return (59 <= val && val <= 76)
  },
  hcl: x => {
    if (x.match(/#[0-9A-Fa-f]{6}\b/)) return true
    return false
  },
  ecl: x => (['amb','blu','brn','gry','grn','hzl','oth'].includes(x)),
  pid: x => {
    if (x.match(/[0-9]{6}\b/) && x.length == 9) return true
    return false
  },
  cid: x => true
}

const part2 = () => {
  const data:string[][] = JSON.parse(JSON.stringify(input))

  const result = data.filter(x => {
    const keys = x.map(y => y[0])
    for (const y of required) {
      if (!keys.includes(y)) return false
    };

    for (const field of x) {
      if (!validation[field[0]](field[1])) return false
    };

    return true
  })

  return result.length
}

/* Tests */

// test()

/* Results */

runPart("Part One:", part1)
runPart("Part Two:", part2)
