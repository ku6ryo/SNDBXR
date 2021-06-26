import { Packer } from "./Packer"
import AdmZip from "adm-zip"

jest.setTimeout(20_000)
test("Pack without resources", async () => {
  const packer = new Packer()
  const script = `
    import { MeshObject, Primitive } from "sndbxr"
    export function main(): void {
      MeshObject.createPrimitive(Primitive.Cube)
    }
  `
  const content = new TextEncoder().encode(script)
  packer.addScript({
    path: "index.ts",
    content,
  })
  await packer.compileScripts()
  const pkg = await packer.pack()
  const buf = Buffer.from(pkg.buffer)
  const unzipper = new AdmZip(buf)
  const wasmEntry = unzipper.getEntry("script.wasm")
  expect(wasmEntry.getData().byteLength).toBeGreaterThan(0)
})

test("Pack with resources", async () => {
  const packer = new Packer()
  const script = `
    import { MeshObject, Primitive } from "sndbxr"
    export function main(): void {
      MeshObject.createPrimitive(Primitive.Cube)
    }
  `
  const content = new TextEncoder().encode(script)
  packer.addScript({
    path: "index.ts",
    content,
  })
  const resource = new Uint8Array([0, 1, 2, 3])
  packer.addResource({
    path: "file.data",
    content: resource
  })
  await packer.compileScripts()
  const pkg = await packer.pack()
  const buf = Buffer.from(pkg.buffer)
  const unzipper = new AdmZip(buf)
  const resourceEntry = unzipper.getEntry("resources\/file.data")
  expect(resourceEntry.getData().byteLength).toBe(resource.byteLength)
})