var ConnectorPlugin = {
  $pointers: {},

  JsInit: function (
    connect,
    getObjectByName,
    setObjectPosition
  ) {
    pointers.connect = connect;
    pointers.getObjectByName = getObjectByName;
    pointers.setObjectPosition = setObjectPosition;
    window.unityPointers = pointers;
  },
  JsTest: function () {
    return 1;
  },
  JsUpdate: function () {
    if (window.connector) {
      window.connector.onUpdate();
    }
  },
};

autoAddDeps(ConnectorPlugin, "$pointers");
mergeInto(LibraryManager.library, ConnectorPlugin); 