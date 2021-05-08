var ConnectorPlugin = {
  $pointers: {},

  JsInit: function (
    getObjectByName,
    setObjectPosition
  ) {
    pointers.getObjectByName = getObjectByName;
    pointers.setObjectPosition = setObjectPosition;
    window.unityPointers = pointers;
  },
  JsTest: function () {
    return 1;
  },
};

autoAddDeps(ConnectorPlugin, "$pointers");
mergeInto(LibraryManager.library, ConnectorPlugin); 