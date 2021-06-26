import {
  MeshObject,
  Primitive,
  StandardMaterial,
  TextureLoader,
  Texture,
  GLTFLoader,
  GroupObject,
  Quaternion,
  Vector3,
} from "sndbxr"

let gltf: GroupObject | null = null
let t = 0.1
let dt = 0.01

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

  const gltfLoader = new GLTFLoader(
    "capsule.glb",
    (obj: GroupObject) => {
      obj.setPosition(new Vector3(0, 1, 0))
      obj.setQuaternion(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2 as f32))
      gltf = obj
    },
    () => {
    },
    () => {
    }
  )
  gltfLoader.load()
}

export function update(): void {
  if (gltf !== null) {
    gltf!.setQuaternion(Quaternion.fromAxisAngle(new Vector3(0, 1, 0), t as f32))
    t += dt
  }
}