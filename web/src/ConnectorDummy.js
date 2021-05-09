
class Connector extends ConnectorBase {

  createImports () {
    let objectId = 0
    return {
      env: {
        getObjectId: (len) => {
          const nameArray = new Uint8Array(module.exports.memory.buffer.slice(0, len))
          console.log(String.fromCharCode.apply(null, nameArray))
          console.log(module.exports.memory.buffer)
          objectId += 1;
          return objectId;
        },
        getObjectPosition: (objectId) => {
          return [0, 1, 2]
        },
        setObjectPosition: (objectId, x, y, z) => {
          return;
        },
        setEventListener: (objectId, type) => {
        },
        log: (type) => {
          console.log(type)
        },
        getTime: () => {
          return Math.round(new Date().getTime() / 1000)
        },
      },
    }
  }
}