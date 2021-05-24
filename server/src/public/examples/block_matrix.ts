import { createPrimitive, Object, PrimitiveType, } from "sndbxr/Object";
import { Vector3 } from "sndbxr/Vector3"

let r: f64 = 0
export function update(): void {
  r += 0.01
  for(let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const d = 0.01 * j * i;
      const obj = mat[i][j]
      if (obj) {
        const p = obj.getPosition()
        obj.setPosition(new Vector3(p.x, p.y, Math.sin(r + d) * 1.5 as f32))
      }
    }
  }
}

const mat: Object[][] = []

export function start(): i32 {
  for(let i = -5; i < 5; i++) {
    const row: Object[] = []
    for (let j = -5; j < 5; j++) {
      const obj = createPrimitive(PrimitiveType.CUBE)
      if (obj) {
        obj.setPosition(new Vector3(i * 1.1 as f32, j * 1.1 as f32, 0));
        row.push(obj)
      }
    }
    mat.push(row)
  }
  return 0
}