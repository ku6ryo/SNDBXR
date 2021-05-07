export enum EventType {
    // PYSICS
    COLLIDE = 1,
    
    // USER
    TOUCH = 1000,

    DRAG = 1100,
    DRAG_START = 1101,
    DRAG_END = 1102,

    // Device
    MOUSE_DOWN = 2000,
    MOUSE_UP = 2001,

    KEY_DOWN = 2100,
    KEY_UP = 2101,
    KEY_PRESS = 2102,

    TRIGGER_TOUCH = 2201,
    TRIGGER_PULL = 2202, 
}