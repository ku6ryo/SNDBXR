using AOT;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

public class SandboxManager: MonoBehaviour {

    static int SandboxNextId = 0;
    static private IDictionary<int, GameObject> SandboxObjMap = new Dictionary<int, GameObject>();

    public void Start ()
    {
        #if UNITY_EDITOR
        string url = "http://localhost:8080/artifacts/test.wasm";
        CreateSandbox(url);
        #else
        #if UNITY_WEBGL
        ConnectorWebGL.WebGLInit();
        ConnectOnLoadRequested(OnLoadRequested);
        ConnectOnDeleteRequested(OnDeleteRequested);
        #endif
        #endif
    }

    static void CreateSandbox(string url)
    {
        var uuid = System.Guid.NewGuid().ToString();
        var id = SandboxNextId;
        var sandboxObj = new GameObject(string.Format("sandbox_{0}_{1}", id, uuid));
        sandboxObj.SetActive(false);
        SandboxObjMap.Add(id, sandboxObj);
        var sandboxClass = sandboxObj.AddComponent<Sandbox>();
        sandboxClass.SetLoadParameters(id, url);
        sandboxObj.SetActive(true);
        SandboxNextId += 1;
    }

    static void DeleteSandbox(int id)
    {
        if (SandboxObjMap.ContainsKey(id))
        {
            var sandboxObj = SandboxObjMap[id];
            Destroy(sandboxObj);
        }
    }

    delegate void dlgOnLoadRequested(string url);
    [MonoPInvokeCallback(typeof(dlgOnLoadRequested))]
    private static void OnLoadRequested(string url)
    {
        CreateSandbox(url);
    }
    [DllImport("__Internal")]
    private static extern int ConnectOnLoadRequested(dlgOnLoadRequested ptr);

    delegate void dlgOnDeleteRequested(int sandboxId);
    [MonoPInvokeCallback(typeof(dlgOnDeleteRequested))]
    private static void OnDeleteRequested(int sandboxId)
    {
        DeleteSandbox(sandboxId);
    }
    [DllImport("__Internal")]
    private static extern int ConnectOnDeleteRequested(dlgOnDeleteRequested ptr);
}