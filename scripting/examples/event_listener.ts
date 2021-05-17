import { createPrimitiveObject, Object, } from "./Object";
import { Color } from "./Color";
import { eventManager } from "./global"
import { EventType } from "./EventType";

export function update(): void {
}

export function start(): i32 {
  const obj = createPrimitiveObject();
  obj.setPosition(1, 1, 1);
  obj.listen(EventType.TOUCH, (obj: Object) => {
    const m = obj.getMaterial();
    if (m) {
      m.setColor(new Color(1, 1, 0, 1))
    }
  })
  return 0
}

export function onEvent (objectId: i32, type: i32): void {
  eventManager.onEvent(objectId, type)
}