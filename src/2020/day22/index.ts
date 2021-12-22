import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) => rawInput.split('\n\n').map(x => x.split('\n').slice(1).map(x => parseInt(x)))

const input:number[][] = prepareInput(readInput())

const playCombat = (player1:number[], player2:number[]) => {
  while (player1.length && player2.length) {
    const card1 = player1.shift()!
    const card2 = player2.shift()!
    if (card1 > card2) player1.push(card1,card2)
    else player2.push(card2,card1)
  }
}

const part1 = () => {
  const player1 = input[0].slice()
  const player2 = input[1].slice()
  playCombat(player1,player2)
  const winner = [player1,player2].filter(x => x.length)[0]
  return winner.reverse().reduce((total,value,index) => total + (value * (index+1)),0)
}



const playCombatB = (player1:number[], player2:number[]) => {
  const history1:string[] = []
  const history2:string[] = []

  while (player1.length && player2.length) {
    if (history1.includes(player1.toString()) || history2.includes(player2.toString())) 
      return [player1,[]]
    history1.push(player1.toString())
    history2.push(player2.toString())

    const card1 = player1.shift()!
    const card2 = player2.shift()!
    
    if (player1.length >= card1 && player2.length >= card2) {
      const result = playCombatB(player1.slice(0,card1),player2.slice(0,card2))
      if (result[0].length > result[1].length) player1.push(card1,card2)
      else player2.push(card2,card1)
      continue
    } 

    if (card1 > card2) player1.push(card1,card2)
    else player2.push(card2,card1)
  }
  return [player1,player2]
}

const part2 = () => {
  const player1 = input[0].slice()
  const player2 = input[1].slice()
  playCombatB(player1,player2)
  const winner = [player1,player2].filter(x => x.length)[0]
  return winner.reverse().reduce((total,value,index) => total + (value * (index+1)),0)
}

/* Tests */

// test()

/* Results */

runPart("Part One:", part1)
runPart("Part Two:", part2)
