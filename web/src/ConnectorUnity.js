
class Connector extends ConnectorBase {

  constructor (unityInstance, unityPointers) {
    super()
    this.unityInstance = unityInstance
    this.unityPointers = unityPointers
  }

  createImports () {
    return {
      env: {
        getObjectId: (len) => {
          return this.unityInstance.Module.dyncall_i(this.unityPointers.getObjectByName)
        },
        getObjectPosition: (objectId) => {
          return [0, 1, 2]
        },
        setObjectPosition: (objectId, x, y, z) => {
          return this.unityInstance.Module.dyncall_vifff(this.unityPointers.setObjectPosition, objectId, x, y, z) 
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