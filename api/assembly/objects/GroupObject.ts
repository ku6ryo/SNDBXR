import { ObjectEventManager } from "./ObjectEventManager";
import { ObjectType } from "./ObjectType";
import { PlainObject } from "./PlainObject";

export class GroupObject extends PlainObject {
  constructor(id: i32, eventManager: ObjectEventManager) {
    super(id, ObjectType.Group, eventManager)
  }
}