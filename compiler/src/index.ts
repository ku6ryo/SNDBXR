import fs, { write } from "fs"
import util from "util"
import path from "path"
import express from "express"
import { compile, createFileSourceMap } from "./compiler"
import { CompileError } from "./compiler"
import { v4 as uuid } from "uuid"
import handleApiError from "./handleApiError"
import handleFinally from "./handleFinally"
import { BadRequestError } from "./errors"

const writeFile = util.promisify(fs.writeFile)

const app = express()
app.use(express.text())
app.use(express.static(path.join(__dirname, "public")))
app.use("/artifacts", express.static(path.join(__dirname, "../artifacts")))

app.use((req, __, next) => {
  console.log(`[${new Date()}] ${req.method} ${req.url}`)
  next()
})

app.post("/api/compile", async (req: express.Request, res: express.Response, next) => {
  const code = req.body as string
  try {
    const result = await compile(await createFileSourceMap(code))
    const id = uuid()
    await writeFile(path.join(__dirname, "../artifacts/", id + ".wasm"), result.wasm)
    await writeFile(path.join(__dirname, "../artifacts/", id + ".wat"), result.wat)

    res.json({
      id,
      wasm: {
        size: result.wasm.length,
      },
      wat: {
        size: result.wat.length,
      }
    })
  } catch (e) {
    if (e instanceof CompileError) {
      next(new BadRequestError(e.message))
    }
    next(e)
  }
})
app.use(handleApiError)
app.use(handleFinally)

app.listen(8080, () => {
  console.log("server started")
})