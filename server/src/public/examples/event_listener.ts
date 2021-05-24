import { createPrimitive, Object, PrimitiveType } from "sndbxr/Object";
import { Color } from "sndbxr/Color";
import { EventType } from "sndbxr/EventType";

export function update(): void {
}

export function start(): i32 {
  const obj = createPrimitive(PrimitiveType.CUBE);
  obj.setPosition(1, 1, 1);
  obj.listen(EventType.TOUCH, (obj: Object) => {
    const m = obj.getMaterial();
    if (m) {
      m.setColor(new Color(1, 1, 0, 1))
    }
  })
  return 0
}