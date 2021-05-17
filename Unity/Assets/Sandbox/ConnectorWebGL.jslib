var ConnectorPlugin = {
  $pointers: {},

  JsInit: function () {
    window.unityPointers = {};
  },
  JsTest: function () {
    return 1;
  },
  JsLoad: function (url) {
    if (window.connector) {
      window.connector.load(url);
    }
  },
  JsStart: function () {
    if (window.connector) {
      window.connector.onStart();
    }
  },
  JsUpdate: function () {
    if (window.connector) {
      window.connector.onUpdate();
    }
  },
  JsSandboxExecV_I: function(i0) {
    if (window.connector) {
      window.connector.sandboxExecV_I(i0);
    }
  },
  JsSandboxExecV_II: function(i0, i1) {
    if (window.connector) {
      window.connector.sandboxExecV_II(i0, i1);
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
  },
  ConnectExecV3_I: function(ptr) {
    window.unityPointers.execV3_I = ptr;
  },
};

autoAddDeps(ConnectorPlugin, "$pointers");
mergeInto(LibraryManager.library, ConnectorPlugin); 