import { test, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) => rawInput.trim().split('').map(Number).reduce((acc, curr, i) => {
  if (i % 2 === 0) {
    acc.push(...new Array(curr).fill(i / 2))
  } else {
    acc.push(...new Array(curr).fill(null))
  }
  return acc
}, [] as number[])

const part1 = (input: Input) => {

  let disk = input.slice()

  let frontIndex = 0
  let backIndex = disk.length - 1

  while (frontIndex <= backIndex) {
    const frontValue = disk[frontIndex]
    const backValue = disk[backIndex]
    if (frontValue !== null) {
      frontIndex++
      continue
    }
    if (backValue === null) {
      backIndex--
      continue
    }

    disk[frontIndex] = backValue
    disk[backIndex] = frontValue

    frontIndex++
    backIndex--
  }

  return disk.reduce((acc, curr, i) => {
    if (curr === null) return acc
    return acc + (curr * i)
  }, 0)
}

interface Group {
  value: number | null
  size: number
}

interface Node {
  value: number | null
  size: number
  next: Node | null
  prev: Node | null
}

const part2 = (input: Input) => {
  let result = input.slice()

  const nodes = result.reduce((acc, value, i) => {
    const previous = acc.at(-1)
    if (previous?.value === value) {
      previous.size++
      return acc
    } else {
      const newNode = {
        value,
        size: 1,
        next: null,
        prev: previous ?? null
      }
      if (previous) previous.next = newNode
      acc.push(newNode)
      return acc
    }
  }, [] as Node[])

  const firstNode = nodes[0]
  let currentNode = nodes.at(-1)!
  while (firstNode !== currentNode) {
    if (currentNode.value === null) {
      currentNode = currentNode.prev!
      continue
    }
    let emptyNode: Node | null = firstNode
    while (true) {
      if (emptyNode.value === null && emptyNode.size >= currentNode.size) break
      if (emptyNode === currentNode) {
        emptyNode = null
        break
      }
      emptyNode = emptyNode.next!
    }

    if (!emptyNode) {
      currentNode = currentNode.prev!
      continue
    }
    const extraSizes = emptyNode.size - currentNode.size

    emptyNode.value = currentNode.value
    emptyNode.size = currentNode.size
    currentNode.value = null

    if (extraSizes > 0) {
      const newNode: Node = {
        value: null,
        size: extraSizes,
        next: emptyNode.next,
        prev: emptyNode
      }
      emptyNode.next = newNode
      nodes.push(newNode)
    }
  }

  let res = []
  let currentNode2: Node | null = nodes[0]
  while (currentNode2 !== null) {
    res.push(...new Array(currentNode2.size).fill(currentNode2.value))
    currentNode2 = currentNode2.next
  }

  return res.reduce((acc, curr, i) => {
    if (curr === null) return acc
    return acc + (curr * i)
  }, 0)

}


/* Tests */

const testInput = prepareInput('2333133121414131402')

test(part1(testInput), 1928)
test(part2(testInput), 2858)

/* Results */

export const main = async (args: string) => {
  const input = runPart('Input', () => prepareInput(args), true)
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
