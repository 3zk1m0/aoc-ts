import { isDeepStrictEqual } from "util"
import kleur from "kleur"

let index = 0

export const test = <T>(result: T, expected: T) => {
  const passed = isDeepStrictEqual(result, expected)

  if (passed) {
    console.log(kleur.green(`${index}: passed`))
  } else {
    console.log(kleur.gray("-----------------------------------------"))
    console.log(kleur.red(`${index}: failed`))
    console.log(kleur.gray("\nResult:"))
    console.dir(result, { colors: true, depth: 0 })
    console.log(kleur.gray("\nExpected:"))
    console.dir(expected, { colors: true, depth: 0 })
    console.log(kleur.gray("-----------------------------------------"))
  }

  index++
}
