import { getObjectByName, Object, } from "./Object";
import { logFloat, logInt, log } from "./env"
import { Color } from "./Color";
import { eventManager } from "./global"
import { EventType } from "./EventType";

let r: f64 = 0;
export function update(): void {
  r += 0.01
  const obj = getObjectByName("Sphere");
  if (obj) {
    obj.setPosition(Math.sin(r) as f32, 0, 0);
    const p = obj.getPosition()
    logFloat(p.x)
  }
}

export function start(): i32 {
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
  return 222
}

export function onEvent (objectId: i32, type: i32): void {
  eventManager.onEvent(objectId, type)
}