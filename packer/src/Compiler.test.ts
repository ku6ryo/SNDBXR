import { Compiler } from "./Compiler"

test("Compile", async () => {
  const compiler = new Compiler("index.ts", {})
  const script = `
    import { MeshObject, Primitive } from "sndbxr"
    export function main(): void {
      MeshObject.createPrimitive(Primitive.Cube)
    }
  `
  compiler.addScript({
    path: "index.ts",
    content: new TextEncoder().encode(script)
  })
  await compiler.compile()
  expect(compiler.wasm).not.toBeNull()
})

test("Compile with dependency file", async () => {
  const compiler = new Compiler("index.ts", {})
  const index = `
    import { create } from "./deep"
    export function main(): void {
      create()
    }
  `
  compiler.addScript({
    path: "index.ts",
    content: new TextEncoder().encode(index)
  })
  const dependency = `
    import { MeshObject, Primitive } from "sndbxr"
    export function create(): void {
      MeshObject.createPrimitive(Primitive.Cube)
    }
  `
  compiler.addScript({
    path: "deep/index.ts",
    content: new TextEncoder().encode(dependency)
  })
  await compiler.compile()
  expect(compiler.wasm).not.toBeNull()
})