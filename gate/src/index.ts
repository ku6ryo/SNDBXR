import fs from "fs"
import path from "path"
import mustache from "mustache"
import { ESLint } from "eslint"

enum ValueType {
  Int32 = "i",
  Int64 = "L",
  Float32 = "f",
  Float64 = "d",
  String = "s",
}

type ValueInterface = {
  isVoid: boolean,
  values: {
    type: ValueType,
    byteUnit: number,
  }[]
}

function createSign(def: ValueInterface): string {
  if (def.isVoid) {
    return "v"
  } else {
    return def.values.map(v => v.type).join("")
  }
}

function parseValueSign(sign: string): ValueInterface {
  const len = sign.length;
  const valueTypes: ValueType[] = []
  for (let i = 0; i < len; i++) {
    const tStr = sign[i]
    if (Object.values(ValueType).includes(tStr as ValueType)) {
      valueTypes.push(tStr as ValueType)
    } else {
      throw new Error(`${tStr} is not known type.`)
    }
  }
  return {
    isVoid: valueTypes.length === 0,
    values: valueTypes.map(t => {
      let byteUnit = 0
      if (t === ValueType.Int32 || t === ValueType.Float32) {
        byteUnit = 4
      } else if (t === ValueType.Int64 || t === ValueType.Float64) {
        byteUnit = 8
      }
      return {
        type: t,
        byteUnit,
      }
    })
  }
}

function parseDefinitions(definitions: [string, string][]) {
  return definitions.map(d => {
    const output = d[0]
    const input = d[1] 
    return {
      output: parseValueSign(output),
      input: parseValueSign(input),
    }
  })
}

function createRenderData(definitions: {
  output: ValueInterface,
  input: ValueInterface,
}[]) {
  return definitions.map(d => {
    return {
      funcName: `callEngine_${createSign(d.output)}_${createSign(d.input)}`,
      isVoid: d.input.isVoid,
      inputs: d.input.values.map((v, i) => {
        return {
          index: i,
          isInt32: v.type === ValueType.Int32,
          isInt64: v.type === ValueType.Int64,
          isFloat32: v.type === ValueType.Float32,
          isFloat64: v.type === ValueType.Float64,
          isString: v.type === ValueType.String,
          isLast: i === d.input.values.length - 1 
        }
      }),
      output: {
        isVoid: d.output.isVoid,
        isInt32: d.output.isVoid ? false : d.output.values[0].type === ValueType.Int32,
        isInt64: d.output.isVoid ? false : d.output.values[0].type === ValueType.Int64,
        isFloat32: d.output.isVoid ? false : d.output.values[0].type === ValueType.Float32,
        isFloat64: d.output.isVoid ? false : d.output.values[0].type === ValueType.Float64,
        byteUnit: d.output.values[0].byteUnit,
        isArray: d.output.values.length > 1,
        length: d.output.values.length,
      }
    }
  })
}

function renderAssemblyScript(definitions: {
  output: ValueInterface,
  input: ValueInterface,
}[]) {
  const template = fs.readFileSync(path.join(__dirname, "templates/asGate.mustache")).toString()
  const functions = createRenderData(definitions)
  const code = mustache.render(template, { functions })
  return code
}

function renderTypeScript(definitions: {
  output: ValueInterface,
  input: ValueInterface,
}[]) {
  const template = fs.readFileSync(path.join(__dirname, "templates/TsGate.mustache")).toString()
  const functions = createRenderData(definitions)
  return mustache.render(template, { functions })
}

async function lintFix(code: string) {
  const eslint = new ESLint({ fix: true })
  const lintResult = await eslint.lintText(code)//code.replace(/\n/g, ""))
  console.log(lintResult[0].source)
  console.log(lintResult[0].messages.map(m => {
    return `LINE ${m.line}: ${m.message}`
  }).join("\n"))
  return lintResult[0].output
}

;(async () => {
  const defs = [
    ["i", "i"],
    ["i", "ii"],
    ["i", "s"],
    ["i", "ifff"],
    ["i", "iffff"],
    ["fff", "i"],
  ] as [string, string][]

  ;(async () => {
    let code = renderAssemblyScript(parseDefinitions(defs))
    try {
      code = await lintFix(code)
    } catch (e) {
      console.error(e)
    }
    fs.writeFileSync(path.join(__dirname, "../artifacts/as_gate.ts"), code)
  })()

  ;(async () => {
    let code = renderTypeScript(parseDefinitions(defs))
    try {
      code = await lintFix(code)
    } catch (e) {
      console.error(e)
    }
    fs.writeFileSync(path.join(__dirname, "../artifacts/ts_gate.ts"), code)
  })()
})()
