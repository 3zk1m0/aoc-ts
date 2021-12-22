import { test, readInput, runPart } from '../../utils'


const prepareInput = (rawInput: string) => {
  const lines = rawInput.split('\n')
  return {
    time: parseInt(lines[0]),
    busses: lines[1].split(',')
  }
}

const input = prepareInput(readInput())

const part1 = () => {
  const data = input.busses.filter(x => x != "x").map(x => parseInt(x))
  const result = data.map(x => ({id: x, time:Math.ceil(input.time / x) * x}))
  result.sort((x,y) =>  x.time - y.time)
  return result[0].id * (result[0].time - input.time)
}


const mul_inv = (a:number, b:number) => {
    let b0 = b
    let x0 = 0
    let x1 = 1
    let q, tmp
    if (b == 1) return 1
    while (a > 1) {
        q = Math.floor(a/b)
        tmp = a
        a = b
        b= tmp%b
        tmp = x0
        x0 = x1 - (q * x0);
        x1 = tmp;
    }
    if (x1 < 0) x1 += b0
    return x1
}

const crt = (n, a) => {
  let sum = 0
  let p = 1
  const prod = n.reduce((x,y) => x * y, 1)
  for(let i=0; i < n.length; i++) {
    p = prod / n[i]
    sum += a[i] * mul_inv(p, n[i]) * p
  }
  return sum % prod
}

const part2 = () => {

  const n = input.busses.map((x, i):[number,string] => [i,x]).filter(x => x[1] != "x").map(x => parseInt(x[1]))
  const a = input.busses.map((x, i):[number,string] => [i,x]).filter(x => x[1] != "x").map(x => parseInt(x[1])-x[0])

  return crt(n,a)
}

/* Tests */

// test()

/* Results */

runPart("Part One:", part1)
runPart("Part Two:", part2)
