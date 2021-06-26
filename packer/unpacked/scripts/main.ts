import {
  MeshObject,
  Primitive,
  StandardMaterial,
  TextureLoader,
  Texture,
} from "sndbxr"


export function start(): void {
  const loader = new TextureLoader(
    "rock.jpg",
    (texture: Texture) => {
      const m = StandardMaterial.create()
      m.setColorMap(texture)
      const c = MeshObject.createPrimitive(Primitive.Sphere)
      c.setMaterial(m)
    },
    () => {
    },
    () => {
    })
  loader.load()
}

export function update(): void {
}