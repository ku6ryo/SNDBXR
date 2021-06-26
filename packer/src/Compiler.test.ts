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