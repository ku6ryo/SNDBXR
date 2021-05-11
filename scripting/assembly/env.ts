/*
export declare function getObjectId(ptr: usize, nameLength: i32): i32
export declare function setObjectPosition(objectId: i32, x: f32, y: f32, z: f32): void
export declare function setEventListener(objectId: i32, type: i32): void
export declare function log(type: i32): void
export declare function getTime(): i32
*/


export declare function execIII(funcId: i32, arg1: i32, arg2: i32): i32;
export declare function execIS(funcId: i32, ptr: i32): i32
export declare function execIIV3(funcId: i32, id: i32, x: f32, y: f32, z: f32): i32
export declare function logInt(value: i32): void