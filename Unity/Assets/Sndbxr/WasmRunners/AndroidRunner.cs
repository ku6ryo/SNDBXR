#if UNITY_ANDROID

using System;
using UnityEngine;
using UnityEngine.Networking;

namespace Sndbxr
{
    public class AndroidRunner : AbstractRunner
    {
        private string ANDROID_WASM_SANDBOX_CLASS = "org.sndbxr.android.lib.WasmSandbox";
        private Sandbox sandbox;
        static private string ANDROID_WASM_SANDBOX_CALLBACK_CLASS = "org.sndbxr.android.lib.OnCallEngine32";
        private AndroidJavaObject wasmExecutorAndroidObj = null;

        class OnCallEngine32 : AndroidJavaProxy {
            private Sandbox sandbox;
            public OnCallEngine32(Sandbox sandbox) : base(AndroidRunner.ANDROID_WASM_SANDBOX_CALLBACK_CLASS) {
                this.sandbox = sandbox;
            }

            public void onCall(AndroidJavaObject call) {
                int funcId = call.Call<int>("getFuncId");

                int numArgs = call.Call<int>("getNumArgs");
                int numReturns = call.Call<int>("getNumReturns");
                FunctionCall callInUnity = new FunctionCall(funcId, numArgs, numReturns);
                var argsInUnity = callInUnity.GetArgs();
                for (int i = 0; i < numArgs; i++)
                {
                    var arg = call.Call<AndroidJavaObject>("getArg", i);
                    var type = arg.Call<int>("getType");
                    if (type == FunctionCall.ValuePack.I32) {
                        argsInUnity[i] = new FunctionCall.ValuePack(arg.Call<int>("getInt"));
                    } else if (type == FunctionCall.ValuePack.F32) {
                        argsInUnity[i] = new FunctionCall.ValuePack(arg.Call<float>("getFloat"));
                    } else {
                        throw new Exception("Unknown arg type");
                    }
                }
                var returnsInUnity = callInUnity.GetReturns();
                for (int i = 0; i < numReturns; i++)
                {
                    var rtn = call.Call<AndroidJavaObject>("getReturn", i);
                    var type = rtn.Call<int>("getType");
                    if (type == FunctionCall.ValuePack.I32) {
                        returnsInUnity[i] = new FunctionCall.ValuePack(0);
                    } else if (type == FunctionCall.ValuePack.F32) {
                        returnsInUnity[i] = new FunctionCall.ValuePack(0f);
                    } else {
                        throw new Exception("Unknown arg type");
                    }
                }

                sandbox.CallEngine32(callInUnity);
                for (int i = 0; i < numReturns; i++)
                {
                    var rtn = call.Call<AndroidJavaObject>("getReturn", i);
                    var type = rtn.Call<int>("getType");
                    if (type == FunctionCall.ValuePack.I32) {
                        call.Call("setReturnInt", i, returnsInUnity[i].GetInt());
                    } else {
                        call.Call("setReturnFloat", i, returnsInUnity[i].GetFloat());
                    }
                }

/**
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
                */
            }
            public void onCallId(int call) {
                Debug.Log("sndbxr call: " + call);
            }
        }

        public AndroidRunner(Sandbox sandbox)
        {
            this.sandbox = sandbox;
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
                androidObj.Call("setOnCallEngine32", new OnCallEngine32(this.sandbox));
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
    }
}
#endif