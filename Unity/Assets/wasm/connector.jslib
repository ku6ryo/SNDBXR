var ConnectorPlugin = {
  $pointers: {},

  JsInit: function () {
    window.unityPointers = {};
  },
  JsTest: function () {
    return 1;
  },
  JsUpdate: function () {
    if (window.connector) {
      window.connector.onUpdate();
    }
  },
  ConnectExecI_I: function(ptr) {
    window.unityPointers.execI_I = ptr;
  },
  ConnectExecI_II: function(ptr) {
    window.unityPointers.execI_II = ptr;
  },
  ConnectExecI_S: function(ptr) {
    window.unityPointers.execI_S = ptr;
  },
  ConnectExecI_IV3: function(ptr) {
    window.unityPointers.execI_IV3 = ptr;
  },
  ConnectExecI_IV4: function(ptr) {
    window.unityPointers.execI_IV4 = ptr;
  }
  ConnectExecV3_I: function(ptr) {
    window.unityPointers.execV3 = ptr;
  },
};

autoAddDeps(ConnectorPlugin, "$pointers");
mergeInto(LibraryManager.library, ConnectorPlugin); 