import { createPrimitiveObject, getObjectByName, Object, PrimitiveType, } from "./Object";
import { logFloat, logInt, log } from "./env"
import { Color } from "./Color";
import { eventManager } from "./global"
import { EventType } from "./EventType";

let r: f64 = 0
export function update(): void {
  r += 0.01
  for(let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const d = 0.01 * j * i;
      const obj = mat[i][j]
      if (obj) {
        // const p = obj.getPosition()
        obj.setPosition((i - 5) * 1.1 as f32, (j -5) * 1.1 as f32, Math.sin(r + d) * 1.5 as f32)
      }
    }
  }
}

const mat: Object[][] = []

export function start(): i32 {
  /*
  const obj = getObjectByName("Cube");
  if (obj) {
    obj.setPosition(1, 1, 1);
    obj.listen(EventType.TOUCH, (obj: Object) => {
      const m = obj.getMaterial();
      if (m) {
        m.setColor(new Color(1, 1, 0, 1))
      }
    })
    return obj.id;
  }
  */
  for(let i = -5; i < 5; i++) {
    const row: Object[] = []
    for (let j = -5; j < 5; j++) {
      const obj = createPrimitiveObject(PrimitiveType.CUBE)
      if (obj) {
        obj.setPosition(i * 1.1 as f32, j * 1.1 as f32, 0);
        row.push(obj)
      }
    }
    mat.push(row)
  }
  return 0
}

export function onEvent (objectId: i32, type: i32): void {
  eventManager.onEvent(objectId, type)
}