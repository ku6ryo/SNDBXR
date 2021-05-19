import path from "path"
import express from "express"
import { compile, createFileSourceMap } from "./compiler"
import { CompileError } from "./compiler"

const app = express()
app.use(express.text())
app.use(express.static(path.join(__dirname, "public")))

app.use((req, __, next) => {
  console.log(`[${new Date()}] ${req.method} ${req.url}`)
  next()
})

app.post("/api/compile", async (req: express.Request, res: express.Response) => {
  const code = req.body as string
  try {
    const result = await compile(await createFileSourceMap(code))
    res.json({
      wasm: {
        size: result.wasm.length,
      },
      wat: {
        size: result.wat.length,
      }
    })
  } catch (e) {
    if (e instanceof CompileError) {
      res.status(400).json({
        message: e.message
      })
    }
  }
})

app.listen(8080, () => {
  console.log("server started")
})