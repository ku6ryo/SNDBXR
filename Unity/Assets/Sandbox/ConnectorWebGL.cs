#if UNITY_WEBGL
using AOT;
using System;
using System.Runtime.InteropServices;

namespace Sndbxr
{

    public class ConnectorWebGL : ConnectorAbstract
    {
        private static Sandbox sandbox = null;

        public ConnectorWebGL(Sandbox sandbox)
        {
            ConnectorWebGL.sandbox = sandbox;
        }

        static Sandbox GetSandbox(int sandboxId)
        {
            return sandbox;
        }

        public static void WebGLInit()
        {
            JsInit();
            ConnectOnLoadCompleted(OnLoadCompleted);
            ConnectCallEngine32(CallEngine32);
        }

        public void Init()
        {
        }
        [DllImport("__Internal")]
        private static extern int JsInit();

        public override void Update(int sandboxId)
        {
            JsUpdate(sandboxId);
        }
        [DllImport("__Internal")]
        private static extern int JsUpdate(int sandboxId);

        public override int Start(int sandboxId)
        {
            JsStart(sandboxId);
            return 0;
        }
        [DllImport("__Internal")]
        private static extern int JsStart(int sandboxId);

        public override void Load(int id, string url)
        {
            var result = JsLoad(id, url);
        }
        [DllImport("__Internal")]
        private static extern int JsLoad(int id, string url);

        delegate void dlgOnLoadCompleted(int id, int status);
        [MonoPInvokeCallback(typeof(dlgOnLoadCompleted))]
        private static void OnLoadCompleted(int sandboxId, int status)
        {
            GetSandbox(sandboxId).OnLoadCompleted(status);
        }
        [DllImport("__Internal")]
        private static extern int ConnectOnLoadCompleted(dlgOnLoadCompleted ptr);

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
        [DllImport("__Internal")]
        private static extern void ConnectCallEngine32(dlgCallEngine32 ptr);

        public override void SandboxExecV_II(int funcId, int i0, int i1)
        {
            JsSandboxExecV_II(funcId, i0, i1);
        }
        [DllImport("__Internal")]
        private static extern int JsSandboxExecV_II(int funcId, int i0, int i1);

        public override void SandboxExecV_I(int funcId, int i0)
        {
            JsSandboxExecV_I(funcId, i0);
        }
        [DllImport("__Internal")]
        private static extern int JsSandboxExecV_I(int funcId, int i0);
    }
}
#endif