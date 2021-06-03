var ConnectorPlugin = {
  $pointers: {},

  JsInit: function () {
    window.unityPointers = {};
    window.connector.onUnityLoad(window.unityInstance, window.unityPointers)
  },
  JsLoad: function (id, urlPtr) {
    if (window.connector) {
      window.connector.load(id, Pointer_stringify(urlPtr));
      return 0;
    }
  },
  JsStart: function (sandboxId) {
    if (window.connector) {
      window.connector.onStart(sandboxId);
    }
  },
  JsUpdate: function (sandboxId) {
    if (window.connector) {
      window.connector.onUpdate(sandboxId);
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
  ConnectOnLoadRequested: function(ptr) {
    window.unityPointers.onLoadRequested = ptr;
  },
  ConnectOnDeleteRequested: function(ptr) {
    window.unityPointers.onDeleteRequested = ptr;
  },
  ConnectOnLoadCompleted: function(ptr) {
    window.unityPointers.onLoadCompleted = ptr;
  },
  ConnectCallEngine32: function(ptr) {
    window.unityPointers.callEngine32 = ptr;
  },
};

autoAddDeps(ConnectorPlugin, "$pointers");
mergeInto(LibraryManager.library, ConnectorPlugin); 