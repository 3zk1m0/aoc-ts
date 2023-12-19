import { test, readInput, runPart, Args } from '../../utils'

type Input = ReturnType<typeof prepareInput>

type Key = 'x' | 'm' | 'a' | 's'

type Rule = {
  comp?: {
    key: Key
    operation: '<' | '>'
    value: number
  }
  dest: string
}

type Workflow = {
  id: string
  rules: Rule[]
}

type WorkBook = Record<string, Workflow>

type Part = Record<Key, number>

const prepareInput = (rawInput: string) => {
  const sections = rawInput.split('\n\n')

  return {
    workflows: sections[0].split('\n').map((line) => {
      const id = RegExp(/(\w+){/).exec(line)![1]
      const rules = RegExp(/{(.+)}/)
        .exec(line)![1]
        .split(',')
        .map((rule) => {
          const [comp, dest] = rule.split(':')
          if (!dest) {
            return {
              dest: comp,
            }
          }

          const check = RegExp(/(\w+)([<>])(.+)/).exec(comp)!

          return {
            comp: {
              key: check[1],
              operation: check[2],
              value: Number(check[3]),
            },
            dest: dest,
          } as Rule
        })
      return {
        id,
        rules,
      }
    }) as Workflow[],

    workflows2: sections[0].split('\n').reduce((acc, line) => {
      const id = RegExp(/(\w+){/).exec(line)![1]
      const rules = RegExp(/{(.+)}/)
        .exec(line)![1]
        .split(',')
        .map((rule) => {
          const [comp, dest] = rule.split(':')
          if (!dest) {
            return {
              dest: comp,
            }
          }

          const check = RegExp(/(\w+)([<>])(.+)/).exec(comp)!

          return {
            comp: {
              key: check[1],
              operation: check[2],
              value: Number(check[3]),
            },
            dest: dest,
          } as Rule
        })
      acc[id] = {
        id,
        rules,
      }
      return acc
    }, {} as WorkBook),

    parts: sections[1]
      .split('\n')
      .map((line) =>
        [...line.matchAll(/(\w+)=(\d+)/g)].reduce(
          (acc, [, key, value]) => ({ ...acc, [key]: parseInt(value) }),
          {} as Record<Key, number>
        )
      ),
  }
}

const isAllowed = (
  where: string,
  workflows: WorkBook,
  part: Part
): boolean => {
  if (where === 'A') return true
  if (where === 'R') return false

  const { rules } = workflows[where]

  for (let rule of rules) {
    if (!rule.comp) {
      return isAllowed(rule.dest, workflows, part)
    }

    const { key, operation: op, value } = rule.comp

    const partValue = part[key]

    if (op === '<') {
      if (partValue < value) {
        return isAllowed(rule.dest, workflows, part)
      }
    }
    if (op === '>') {
      if (partValue > value) {
        return isAllowed(rule.dest, workflows, part)
      }
    }
  }

  return where === 'A'
}

const part1 = (input: Input) => {
  return input.parts
    .filter((part) => isAllowed('in', input.workflows2, part))
    .reduce((acc, part) => acc + part.x + part.m + part.a + part.s, 0)
}

function validCombinations(
  where: string,
  workflows: WorkBook,
  partRange: Record<Key, [number, number]>,
  index: number
): number {
  if (where === 'A') {
    return Object.values(partRange).reduce(
      (acc, [a, b]) => acc * (b - a + 1),
      1
    )
  }

  if (where === 'R') {
    return 0
  }

  const { rules } = workflows[where]
  const step = rules[index]

  if (!step.comp) {
    return validCombinations(step.dest, workflows, partRange, 0)
  }

  const { key, operation, value } = step.comp

  if (operation === '>') {
    if (value < partRange[key][0]) {
      return validCombinations(step.dest, workflows, partRange, 0)
    }

    if (value > partRange[key][1]) {
      return 0
    }

    const ss = { ...partRange }
    ss[key] = [partRange[key][0], value]
    const a = validCombinations(where, workflows, ss, index + 1)

    ss[key] = [value + 1, partRange[key][1]]
    const b = validCombinations(step.dest, workflows, ss, 0)

    return a + b
  }

  if (operation === '<') {
    if (value < partRange[key][0]) {
      return 0
    }

    if (value > partRange[key][1]) {
      return validCombinations(step.dest, workflows, partRange, 0)
    }

    const ss = { ...partRange }
    ss[key] = [partRange[key][0], value - 1]
    const a = validCombinations(step.dest, workflows, ss, 0)

    ss[key] = [value, partRange[key][1]]
    const b = validCombinations(where, workflows, ss, index + 1)

    return a + b
  }

  return validCombinations(step.dest, workflows, partRange, 0)
}

const part2 = (input: Input) => {
  const sss: Record<Key, [number, number]> = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  }

  return validCombinations('in', input.workflows2, sss, 0)
}

/* Tests */

// test()

/* Results */

export const main = async (args: Args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
