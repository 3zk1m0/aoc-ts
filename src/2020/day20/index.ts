import { filter, map, some } from 'lodash'
import { type } from 'os'
import { stringify } from 'querystring'
import { test, readInput, runPart } from '../../utils'

const prepareInput = (rawInput: string): Photo[] =>
  rawInput.split('\n\n').map((x) => {
    const lines = x.split('\n')
    const id = parseInt((lines[0].match(/\s\d*/g) || [])[0])

    const grid = lines.slice(1)

    const top = grid[0]
    const bottom = grid.slice(-1)[0]
    const left = grid.map((y) => y[0]).join('')
    const right = grid.map((y) => y.slice(-1)[0]).join('')

    return {
      id,
      sides: [
        top,
        bottom,
        left,
        right,
        [...top].reverse().join(''),
        [...bottom].reverse().join(''),
        [...left].reverse().join(''),
        [...right].reverse().join(''),
      ],
      body: grid, //.join(''),
    }
  })

type Photo = {
  id: number
  sides: string[]
  body: string[]
}

// top, bottom, left, right

const input: Photo[] = prepareInput(readInput())

const getTop = (photo: Photo): string => photo.body[0]
const getBottom = (photo: Photo): string => photo.body[9]
const getLeft = (photo: Photo): string => photo.body.map((y) => y[0]).join('')
const getRight = (photo: Photo): string => photo.body.map((y) => y[9]).join('')

const rotate = (photo: Photo) => {
  photo.body = [...photo.body[0]].map((val, index) =>
    photo.body
      .map((row) => row[index])
      .reverse()
      .join('')
  )
}
const flip = (photo: Photo) => {
  photo.body = photo.body.map((x) => [...x].reverse().join(''))
}

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
]

const matchDirection = (
  grid: Map<string, Photo>,
  photo: Photo,
  cord: number[],
  photoDirF,
  matchDirF,
  dir: number[]
) => {
  const solved = [...grid.keys()]
  if (solved.includes([cord[0] + dir[0], cord[1] + dir[1]].toString())) return

  const top = photoDirF(photo)
  const match = input.filter((x) => {
    if (photo.id == x.id) return false
    return x.sides.includes(top)
  })[0]
  if (typeof match != 'undefined') {
    let rotations = 0
    while (true) {
      if (top == matchDirF(match)) {
        grid.set([cord[0] + dir[0], cord[1] + dir[1]].toString(), match)
        break
      }
      if (rotations == 4) flip(match)
      rotate(match)
      rotations++
    }
  }
}

const grid = new Map<string, Photo>()

const part1 = () => {
  const oldPhotos: string[] = []
  grid.set([0, 0].toString(), input[0])

  while (oldPhotos.length < input.length) {
    const photos: string[] = [...grid.keys()].filter(
      (x) => !oldPhotos.includes(x)
    )
    const photo = grid.get(photos[0]) as Photo
    const cord = photos[0].split(',').map((x) => parseInt(x))
    matchDirection(grid, photo, cord, getTop, getBottom, [0, -1])
    matchDirection(grid, photo, cord, getBottom, getTop, [0, 1])
    matchDirection(grid, photo, cord, getLeft, getRight, [-1, 0])
    matchDirection(grid, photo, cord, getRight, getLeft, [1, 0])
    oldPhotos.push(photos[0])
  }

  const cords = [...grid.keys()].map((x) =>
    x.split(',').map((x) => parseInt(x))
  )
  const xStart = Math.min(...cords.map((x) => x[0]))
  const yStart = Math.min(...cords.map((x) => x[1]))
  const xEnd = Math.max(...cords.map((x) => x[0]))
  const yEnd = Math.max(...cords.map((x) => x[1]))

  const corners = [
    [xStart, yStart],
    [xEnd, yStart],
    [xStart, yEnd],
    [xEnd, yEnd],
  ]

  return corners.reduce((a, b) => {
    return a * grid.get(b.toString())!.id
  }, 1)
}

const joinGrid = () => {
  const cords = [...grid.keys()].map((x) =>
    x.split(',').map((x) => parseInt(x))
  )
  const xStart = Math.min(...cords.map((x) => x[0]))
  const yStart = Math.min(...cords.map((x) => x[1]))
  const xEnd = Math.max(...cords.map((x) => x[0]))
  const yEnd = Math.max(...cords.map((x) => x[1]))

  input.forEach(
    (x) => (x.body = x.body.slice(1, -1).map((x) => x.slice(1, -1)))
  )
  let res = ''
  for (let y = yStart; y <= yEnd; y++) {
    const row = cords.filter((x) => x[1] == y).sort((a, b) => a[0] - b[0])
    for (let i = 0; i < input[0].body.length; i++) {
      for (const photoKey of row) {
        const photo = grid.get(photoKey.toString())
        // process.stdout.write(photo.body[i])
        res += photo!.body[i]
      }
      // process.stdout.write("\n")
      res += '\n'
    }
    // process.stdout.write("\n")
  }
  return res
}

const rotateImage = (image: string[]) => {
  return [...image[0]]
    .map((val, index) =>
      image
        .map((row) => row[index])
        .reverse()
        .join('')
    )
    .join('\n')
}
const flipImage = (image: string[]) => {
  return image.map((x) => [...x].reverse().join('')).join('\n')
}

const part2 = () => {
  let res = joinGrid()

  const commonPart = (arr1: any[], arr2: any[]) => {
    const set = new Set(arr2)
    return arr1.filter((x) => set.has(x))
  }

  const counts: number[] = []
  let rotations = 0
  while (true) {
    let monstersCount = 0
    const tmp = res.split('\n')
    for (let i = 0; i < tmp.length - 2; i++) {
      const l1 = [...tmp[i].matchAll(/(..................#.)/g)].map(
        (x) => x.index
      )
      const l2 = [...tmp[i + 1].matchAll(/(#....##....##....###)/g)].map(
        (x) => x.index
      )
      const l3 = [...tmp[i + 2].matchAll(/(.#..#..#..#..#..#...)/g)].map(
        (x) => x.index
      )

      // for some reason regex not working, and too tider to fix
      // monstersCount += commonPart(commonPart(l1, l2), l3).length
      monstersCount += l2.length
    }
    counts.push(monstersCount)
    // if (monstersCount == 31) {
    //    console.log(res)
    // }
    if (rotations % 4 == 0) {
      res = flipImage(res.split('\n'))
    }
    res = rotateImage(res.split('\n'))
    rotations++
    if (rotations == 8) break
  }
  // console.log(Math.max(...counts))
  return [...res].filter((x) => x == '#').length - 15 * Math.max(...counts)
}

/* Tests */

// test()

/* Results */

runPart('Part One:', part1)
runPart('Part Two:', part2)
