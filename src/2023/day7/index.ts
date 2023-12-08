import { test, readInput, runPart } from '../../utils'

type Input = ReturnType<typeof prepareInput>

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => {
    const [cards, bid] = line.split(' ')
    return {
      bid: parseInt(bid),
      cards: cards.split(''),
    }
  })

const getType = (cards: string[]) => {
  const freq = cards.reduce((acc, card) => {
    if (!acc[card]) acc[card] = 0
    acc[card]++
    return acc
  }, {})
  const so = Object.values(freq).sort().reverse()
  if (so[0] === 5) return 6
  if (so[0] === 4) return 5
  if (so[0] === 3 && so[1] === 2) return 4
  if (so[0] === 3) return 3
  if (so[0] === 2 && so[1] === 2) return 2
  if (so[0] === 2) return 1
  return 0
}

const CARDS_PART_1 = 'AKQJT98765432'
  .split('')
  .reverse()
  .reduce((acc, card, i) => {
    acc[card] = i
    return acc
  }, {})

const part1 = (input: Input) => {
  return input
    .map((hand) => ({
      hand,
      type: getType(hand.cards),
    }))
    .sort((a, b) => {
      if (a.type !== b.type) return b.type - a.type
      for (let i = 0; i < a.hand.cards.length; i++) {
        if (a.hand.cards[i] !== b.hand.cards[i]) {
          return CARDS_PART_1[b.hand.cards[i]] - CARDS_PART_1[a.hand.cards[i]]
        }
      }
      return 0
    })
    .reverse()
    .map((hand, i) => hand.hand.bid * (i + 1))
    .reduce((acc, val) => acc + val, 0)
}

const getTypeWithJoker = (cards: string[]) => {
  if (!cards.includes('J')) return getType(cards)
  return 'AKQT98765432'.split('').reduce((acc, card, i) => {
    const up = cards.join('').replace(/J/g, card)
    return Math.max(acc, getType(up.split('')))
  }, 0)
}

const CARDS_PART_2 = 'AKQT98765432J'
  .split('')
  .reverse()
  .reduce((acc, card, i) => {
    acc[card] = i
    return acc
  }, {})

const part2 = (input: Input) => {
  return input
    .map((hand) => ({
      hand,
      type: getTypeWithJoker(hand.cards),
    }))
    .sort((a, b) => {
      if (a.type !== b.type) return b.type - a.type
      for (let i = 0; i < a.hand.cards.length; i++) {
        if (a.hand.cards[i] !== b.hand.cards[i]) {
          return CARDS_PART_2[b.hand.cards[i]] - CARDS_PART_2[a.hand.cards[i]]
        }
      }
      return 0
    })
    .reverse()
    .map((hand, i) => hand.hand.bid * (i + 1))
    .reduce((acc, val) => acc + val, 0)
}

/* Tests */

const SAMPLE_DATA = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`

const sampleInput = prepareInput(SAMPLE_DATA)

test(part1(sampleInput), 6440)
test(part2(sampleInput), 5905)

test(getType("AAAAA".split('')), 6)
test(getType("AAAAB".split('')), 5)
test(getType("AAABB".split('')), 4)
test(getType("AAABC".split('')), 3)
test(getType("AABBD".split('')), 2)
test(getType("AABCD".split('')), 1)
test(getType("ABCDE".split('')), 0)

test(getTypeWithJoker("JAAAA".split('')), 6)
test(getTypeWithJoker("JAAAB".split('')), 5)
test(getTypeWithJoker("JAABB".split('')), 4)
test(getTypeWithJoker("JAABC".split('')), 3)
test(getTypeWithJoker("JABBD".split('')), 2)
test(getTypeWithJoker("JABCD".split('')), 1)
test(getTypeWithJoker("JBCDE".split('')), 0)



/* Results */

export const main = async (args) => {
  const input: any = prepareInput(await readInput(args))
  runPart('Part One:', () => part1(input))
  runPart('Part Two:', () => part2(input))
}
