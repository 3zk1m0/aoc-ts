import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string) => rawInput.split(',').map(x=>parseInt(x))

const input = prepareInput(readInput())

const part1 = () => {
  const numbers =  [...input]

  for (let i = numbers.length; i < 2020; i++) {

    const d1 = numbers.lastIndexOf(numbers[i-1]);
    const d2 = numbers.lastIndexOf(numbers[i-1],d1-1);

    if (d1 < 0 || d2 < 0) {
      numbers.push(0)
    } else {
      numbers.push(d1-d2)
    }
  }

  return numbers.slice(-1)[0]
}

const part2 = () => {
  const numbers = new Map();
  input.forEach((o, i) => numbers.set(o, [i + 1]));

  let last = numbers.size;

  for (let i = numbers.size+1; i <= 30000000; i++) {
    const turns = numbers.get(last);

    last = turns?.length > 1 ? turns[0]-turns[1] : 0

    const indices = numbers.get(last);

    if (indices) {
      indices.unshift(i);
      if (indices.length > 2) indices.pop();
    } else {
      numbers.set(last, [i]);
    }
  }

  return last;
}

/* Tests */

// test()

/* Results */

runPart("Part One:", part1)
runPart("Part Two:", part2)
