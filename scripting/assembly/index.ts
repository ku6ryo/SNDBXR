/*
import { eventManager } from "./global"
import { EventType } from "./EventType"
import { getObjectByName, log, getTime, } from "./tool"
import { Object } from "./object"

export function main (): i32 {
  let o = getObjectByName("cube")
  if (o === null) {
    return 1
  }
  return 0
}

let i = 0;
export function update(): void {
  let o = getObjectByName("cube")
  if (o !== null) {
    o.setPosition(i * 0.1 as f32, 0, 0)
    i += 1
  }
}

export function check (): void {
  log(getTime())
  log(i)
}

export function onEvent (objectId: i32, type: EventType): void {
  eventManager.onEvent(objectId, type)
}
*/

import { getObjectByName } from "./object";
import { logInt, } from "./env"

class A {
  id: i32 = 0;
   constructor() {
     this.id = 100;
   }
}

let i: f64 = 0;
export function update(): void {
  const obj = getObjectByName("Cube");
  if (obj) {
    obj.setPosition(Math.sin(i) as f32, 1, 1);
    i += 0.01
  }
}

export function Test(): i32 {
  const a = new A();
  logInt(10);
  const obj = getObjectByName("Cube");
  if (obj) {
    obj.setPosition(1, 1, 1);
    return obj.id;
  }
  return a.id
}
