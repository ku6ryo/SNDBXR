using AOT;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

namespace Sndbxr
{
    /**
    * Controls (creates / removes) sandboxes.
    */
    public class SandboxManager: MonoBehaviour {

        /**
        * Counter to generates a unique ID for each sandbox.
        */
        static int SandboxNextId = 0;
        /**
        * Dictionaly to store running sandboxes.
        */
        static private IDictionary<int, GameObject> SandboxObjMap = new Dictionary<int, GameObject>();

        /**
        * For debuging.
        * If LOAD_INITIAL_SANDBOX is true, loads WASM file in INITIAL_SANDBOX_WASM_URL and creates a sanbox at start.
        */
        static private bool LOAD_INITIAL_SANDBOX = true;
        static private string INITIAL_SANDBOX_WASM_URL = "http://192.168.1.5:8080/artifacts/468c176a-26d1-43ff-bbc7-2579bfd3c63e.wasm";

        public void Start ()
        {
            // WebGL needs setup to connect JS.
            #if !UNITY_EDITOR && UNITY_WEBGL
                WebGLRunner.WebGLInit();
                ConnectOnLoadRequested(OnLoadRequested);
                ConnectOnDeleteRequested(OnDeleteRequested);
            #endif
            if (LOAD_INITIAL_SANDBOX) {
                CreateSandbox(INITIAL_SANDBOX_WASM_URL);
            }
        }

        /**
        * Creates a sandbox with WASM URL.
        * @param url WASM file URL.
        */
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

        /**
        * Deletes a sandbox by ID.
        */
        static void DeleteSandbox(int id)
        {
            if (SandboxObjMap.ContainsKey(id))
            {
                var sandboxObj = SandboxObjMap[id];
                Destroy(sandboxObj);
            }
        }

    // For WebGL only
    #if UNITY_WEBGL

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
    #endif
    }
}