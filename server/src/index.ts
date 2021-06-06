import fs from "fs"
import util from "util"
import path from "path"
import express from "express"
import { compile, createFileSourceMap } from "./compiler"
import { CompileError } from "./compiler"
import { v4 as uuid } from "uuid"
import handleApiError from "./handleApiError"
import handleFinally from "./handleFinally"
import { BadRequestError } from "./errors"
import compression from "compression"
import serveStatic from "serve-static"
import cors from "cors"
import multer from "multer"

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../assets")
})
const upload = multer({
  storage,
  limits: { fileSize: 1000_000_000 },
}).single("asset")

const writeFile = util.promisify(fs.writeFile)

const app = express()
app.use(cors())

app.use((req, __, next) => {
  console.log(`[${new Date()}] ${req.method} ${req.url}`)
  next()
})
app.use(express.text())
app.use("/", serveStatic(path.join(__dirname, "public"), {
  setHeaders: (res, path) => {
    if (path.endsWith(".br")) {
      res.setHeader("Content-Encoding", "br")
    }
    if (path.endsWith(".gz")) {
      res.setHeader("Content-Encoding", "gzip")
    }
  }
}))
app.use(compression())
app.use("/artifacts", express.static(path.join(__dirname, "../artifacts")))
app.use("/assets", express.static(path.join(__dirname, "../assets")))

app.get("/", (req ,res) => {
  res.send("no content yet")
})

app.post("/api/compile", async (req: express.Request, res: express.Response, next) => {
  const code = req.body as string
  if (!code) {
      next(new BadRequestError("Code data is not given."))
      return
  }
  if (code.length > 10000) {
      next(new BadRequestError("Number of characters cannot be more than 10000."))
      return
  }
  try {
    const result = await compile(await createFileSourceMap(code))
    const id = uuid()
    await writeFile(path.join(__dirname, "../artifacts/", id + ".wasm"), result.wasm)
    await writeFile(path.join(__dirname, "../artifacts/", id + ".wat"), result.wat)
    await writeFile(path.join(__dirname, "../artifacts/", id + ".wasm.map"), result.sourceMap)
    await writeFile(path.join(__dirname, "../artifacts/", id + ".ts"), code)

    res.json({
      id,
      script: {
        path: "/artifacts/" + id + ".ts",
        size: code.length,
      },
      wasm: {
        path: "/artifacts/" + id + ".wasm",
        size: result.wasm.length,
      },
      wat: {
        path: "/artifacts/" + id + ".wat",
        size: result.wat.length,
      },
      sourceMap: {
        path: "/artifacts/" + id + ".wasm.map",
        size: result.sourceMap.length,
      }
    })
  } catch (e) {
    if (e instanceof CompileError) {
      next(new BadRequestError(e.message))
    }
    next(e)
  }
})
app.post("/api/upload", upload, async (req, res, next) => {
  const id = req.file.filename
  res.json({
    id,
    name: req.file.originalname,
    path: "/assets/" + id
  })
})
app.use(handleApiError)
app.use(handleFinally)

app.listen(process.env.PORT || 8080, () => {
  console.log("server started")
})