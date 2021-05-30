#if UNITY_EDITOR || UNITY_STANDALONE_WIN || UNITY_STANDALONE_OSX
using System;
using UnityEngine;
using UnityEngine.Networking;
using WasmerSharp;

namespace Sndbxr {
    /// https://github.com/migueldeicaza/WasmerSharp
    public class WasmerSharpRunner
    {
        private static Sandbox sandbox;
        private static Instance wasmInstance = null;

        public static void Load(Sandbox sandbox, string url)
        {
            WasmerSharpRunner.sandbox = sandbox;
            UnityWebRequest req = UnityWebRequest.Get(url);
            req.SendWebRequest().completed += operation =>
            {
                if (req.result != UnityWebRequest.Result.Success) {
                    Debug.Log(req.error);
                    sandbox.OnLoadCompleted(1);
                }
                var wasm = req.downloadHandler.data;
                var imports = CreateImports();
                wasmInstance = new Instance(wasm, imports);
                sandbox.OnLoadCompleted(0);
            };
        }
        
        delegate void CallEngine32Callback(InstanceContext ctx, int ptrOffset, int funcId);

        private static Import[] CreateImports()
        {
            // This creates a memory block with a minimum of 256 64k pages
            // and a maxium of 256 64k pages
            var memory = Memory.Create(minPages: 256);
            // Now we surface the memory as an import
            var memoryImport = new Import ("env", "memory", memory);

            var abortFunc = new Import ("env", "abort", 
                    new ImportFunction ((Action<InstanceContext, int, int, int, int>) (Abort)));
            CallEngine32Callback d = CallEngine32;
            var callEngine32Func = new Import ("proto", "_callEngine32", new ImportFunction(d));

            Import[] imports = new Import[] {
                memoryImport,
                abortFunc,
                callEngine32Func,
            };
            return imports;
        }

        public static void Start()
        {
            wasmInstance.Call("start");
        }
        public static void Update()
        {
            wasmInstance.Call("update");
        }
        public static void Abort (InstanceContext ctx, int msgPtr, int filenamePtr, int lineNum, int columNum)
        {
            Debug.Log("Abort");
            Debug.Log(lineNum);
            Debug.Log(columNum);
            /*
            var memoryBase = ctx.GetMemory (0).Data;
            unsafe {
                var str = Encoding.UTF8.GetString ((byte*)memoryBase + ptr, len);

                Console.WriteLine ("Received this utf string: [{0}]", str);
            }
            */
        }

        private static void CallEngine32(InstanceContext ctx, int ptrOffset, int funcId)
        {
            unsafe {
                var memoryBase = ctx.GetMemory(0).Data;
                var iPtr = (int*) ((byte*) memoryBase + ptrOffset);
                var fPtr = (float*) ((byte*) memoryBase + ptrOffset);
                var numArgs = (int) *iPtr;
                var numReturns = (int) *(iPtr + 1);
                var call = new FunctionCall(funcId, numArgs, numReturns);
                for (int i = 0; i < numArgs; i++) {
                    int type = (int) *(iPtr + 2 + i * 1);
                    var args = call.GetArgs();
                    if (type == FunctionCall.ValuePack.I32) {
                        args[i] = new FunctionCall.ValuePack((int) *(iPtr + 2 + numArgs * 1 + 1 + i));
                    } else if (type == FunctionCall.ValuePack.F32) {
                        args[i] = new FunctionCall.ValuePack((float) *(fPtr + 2 + numArgs * 1 + 1 + i));
                    } else {
                        throw new Exception("Unknown arg type");
                    }
                }
                for (int i = 0; i < numReturns; i++) {
                    int type = (int) *(iPtr + 2 + numArgs + i * 1);
                    var returns = call.GetReturns();
                    if (type == FunctionCall.ValuePack.I32) {
                        returns[i] = new FunctionCall.ValuePack(0);
                    } else if (type == FunctionCall.ValuePack.F32) {
                        returns[i] = new FunctionCall.ValuePack(0f);
                    } else {
                        throw new Exception("Unknown arg type");
                    }
                }
                if (sandbox == null) {
                    throw new Exception("Sandbox is NULL.");
                }
                sandbox.CallEngine32(call);
            }
        }
    }
}
#endif