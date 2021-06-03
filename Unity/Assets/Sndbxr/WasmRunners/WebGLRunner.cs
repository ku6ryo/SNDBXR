#if UNITY_WEBGL
using AOT;
using System;
using System.Runtime.InteropServices;
using System.Collections.Generic;

namespace Sndbxr
{
    public class WebGLRunner : AbstractRunner
    {
        static private IDictionary<int, Sandbox> SandboxMap = new Dictionary<int, Sandbox>();
        
        [DllImport("__Internal")]
        private static extern int JsInit();

        [DllImport("__Internal")]
        private static extern int JsUpdate(int sandboxId);
        [DllImport("__Internal")]
        private static extern int JsStart(int sandboxId);
        [DllImport("__Internal")]
        private static extern int JsLoad(int id, string url);

        [DllImport("__Internal")]
        private static extern int ConnectOnLoadCompleted(dlgOnLoadCompleted ptr);

        [DllImport("__Internal")]
        private static extern void ConnectCallEngine32(dlgCallEngine32 ptr);

        public WebGLRunner(Sandbox sandbox)
        {
            SandboxMap.Add(sandbox.id, sandbox);
        }
        public static void WebGLInit()
        {
            JsInit();
            ConnectOnLoadCompleted(OnLoadCompleted);
            ConnectCallEngine32(CallEngine32);
        }

        static Sandbox GetSandbox(int sandboxId)
        {
            var sandbox = SandboxMap[sandboxId];
            if (sandbox == null) {
                throw new Exception("No sandbox found for ID: " + sandboxId);
            }
            return sandbox;
        }

        public override void Update(int sandboxId)
        {
            JsUpdate(sandboxId);
        }
        public override int Start(int sandboxId)
        {
            JsStart(sandboxId);
            return 0;
        }

        public override void Load(int id, string url)
        {
            var result = JsLoad(id, url);
        }

        delegate void dlgOnLoadCompleted(int id, int status);
        [MonoPInvokeCallback(typeof(dlgOnLoadCompleted))]
        private static void OnLoadCompleted(int sandboxId, int status)
        {
            GetSandbox(sandboxId).OnLoadCompleted(status);
        }

        delegate void dlgCallEngine32(IntPtr p, int funcId, int sandboxId);
        [MonoPInvokeCallback(typeof(dlgCallEngine32))]
        private static void CallEngine32(IntPtr p, int funcId, int sandboxId)
        {
            var header = new int[2];
            Marshal.Copy(p, header, 0, 2);
            var numArgs = header[0];
            var numReturns = header[1];
            var total32Units = 2 + numArgs * 2 + numReturns * 2;
            var allInts = new int[total32Units];
            var allFloats = new float[total32Units];
            Marshal.Copy(p, allInts, 0, total32Units);
            Marshal.Copy(p, allFloats, 0, total32Units);

            var call = new FunctionCall(funcId, numArgs, numReturns);
            var args = call.GetArgs();
            for (int i = 0; i < numArgs; i++) {
                int type = allInts[2 + i];
                if (type == FunctionCall.ValuePack.I32) {
                    args[i] = new FunctionCall.ValuePack(allInts[2 + numArgs + numReturns + i]);
                } else if (type == FunctionCall.ValuePack.F32) {
                    args[i] = new FunctionCall.ValuePack(allFloats[2 + numArgs + numReturns + i]);
                } else {
                    throw new Exception("Unknown arg type");
                }
            }
            var returns = call.GetReturns();
            for (int i = 0; i < numReturns; i++) {
                int type = allInts[2 + numArgs + i];
                if (type == FunctionCall.ValuePack.I32) {
                    returns[i] = new FunctionCall.ValuePack(0);
                } else if (type == FunctionCall.ValuePack.F32) {
                    returns[i] = new FunctionCall.ValuePack(0f);
                } else {
                    throw new Exception("Unknown return type");
                }
            }

            var sandbox = GetSandbox(sandboxId);
            if (sandbox == null) {
                throw new Exception("Sandbox is NULL.");
            }

            // At this step, return values are set in Sandbox logics.
            sandbox.CallEngine32(call);

            unsafe {
                for (int i = 0; i < numReturns; i++) {
                    var v = returns[i];
                    var type = v.GetValueType();
                    if (type == FunctionCall.ValuePack.I32) {
                        *(((int*) p) + 2 + numArgs * 2 + numReturns + i) = v.GetInt();
                    } else if (type == FunctionCall.ValuePack.F32) {
                        *(((float*) p) + 2 + numArgs * 2 + numReturns + i) = v.GetFloat();
                    } else {
                        throw new Exception("Unknown return type");
                    }
                }
            }
        }
    }
}
#endif