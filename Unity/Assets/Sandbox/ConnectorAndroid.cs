using UnityEngine;
using System.Collections.Generic;
using UnityEngine.Networking;
using UnityEngine.Android;

public class ConnectorAndroid : ConnectorAbstract
{
    private string ANDROID_WASM_SANDBOX_CLASS = "org.sndbxr.android.lib.WasmSandbox";
    private Sandbox sandbox;
    static private string ANDROID_WASM_SANDBOX_CALLBACK_CLASS = "org.sndbxr.android.lib.OnCallEngine32";
    private int id = -1;
    private static Sandbox SandboxInstance = null;
    private static int SandboxNextId = 0;
    private static IDictionary<int, Sandbox> SandboxIdMap = new Dictionary<int, Sandbox>();

    private AndroidJavaObject wasmExecutorAndroidObj = null;

    class OnCallEngine32 : AndroidJavaProxy {
        private Sandbox sandbox;
        public OnCallEngine32(Sandbox sandbox) : base(ConnectorAndroid.ANDROID_WASM_SANDBOX_CALLBACK_CLASS) {
            this.sandbox = sandbox;
        }

        public void onCall(AndroidJavaObject call) {
            Debug.Log("sndbxr: CALLLLL");
            int funcId = call.Call<int>("getFuncId");
            Debug.Log("sndbxr: funcId " + funcId);
            Debug.Log("sndboxr: sandbox id");

            if (funcId == 1001) {
                call.Call("setReturnInt", 0, sandbox.ExecI_I(funcId, call.Call<int>("getArgInt", 0)));
            }
            if (funcId == 1100) {
                sandbox.ExecI_IV3(
                    funcId,
                    call.Call<int>("getArgInt", 0),
                    call.Call<float>("getArgFloat", 1),
                    call.Call<float>("getArgFloat", 2),
                    call.Call<float>("getArgFloat", 3)
                );
            }
        }
        public void onCallId(int call) {
            Debug.Log("sndbxr call: " + call);
        }
    }

    public ConnectorAndroid(Sandbox sandbox)
    {
        SandboxInstance = sandbox;
        SandboxIdMap.Add(SandboxNextId, sandbox);
        this.id = SandboxNextId;
        SandboxNextId += 1;
        this.sandbox = sandbox;
    }

    static Sandbox GetSandbox()
    {
        return SandboxInstance;
        // return SandboxIdMap[id];
    }

    public override void Load(int sandboxId, string url)
    {
        UnityWebRequest req = UnityWebRequest.Get(url);
        req.SendWebRequest().completed += operation =>
        {
            if (req.result != UnityWebRequest.Result.Success) {
                Debug.Log(req.error);
                return;
            }

            var wasm = req.downloadHandler.data;
            Debug.Log("WASM fetched: " + wasm.Length);
            var androidObj = new AndroidJavaObject(ANDROID_WASM_SANDBOX_CLASS, wasm);
            androidObj.Call("setOnCallEngine32", new OnCallEngine32(SandboxIdMap[sandboxId]));
            androidObj.Call("run");
            this.wasmExecutorAndroidObj = androidObj;
            this.sandbox.OnLoadCompleted(0);
        };
    }

    public override int Start(int sandboxId)
    {
        return 0;
    }
    public override void Update(int sandboxId)
    {
        this.wasmExecutorAndroidObj.Call("update");
    }
    public override void SandboxExecV_II(int funcId, int i0, int i1)
    {
    }
    public override void SandboxExecV_I(int funcId, int loaderId)
    {
    }
}