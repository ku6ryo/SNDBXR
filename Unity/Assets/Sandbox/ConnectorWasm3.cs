using System;
using UnityEngine;
using System.Collections.Generic;
using Wasm3DotNet;
using Wasm3DotNet.Wrapper;
using UnityEngine.Networking;
using System.Runtime.InteropServices;


/// Connector using Wasm3DotNet
/// https://github.com/tana/Wasm3DotNet
public class ConnectorWasm3 : ConnectorAbstract
{
    private int id = -1;
    private static Sandbox SandboxInstance = null;
    private static int SandboxNextId = 0;
    private static IDictionary<int, Sandbox> SandboxIdMap = new Dictionary<int, Sandbox>();

    private static Runtime runtime = null;

    public ConnectorWasm3(Sandbox sandbox)
    {
        SandboxInstance = sandbox;
        SandboxIdMap.Add(SandboxNextId, sandbox);
        this.id = SandboxNextId;
        SandboxNextId += 1;
    }

    static Sandbox GetSandbox()
    {
        return SandboxInstance;
        // return SandboxIdMap[id];
    }

    public override void Load(string url, Action<bool> callback)
    {
        UnityWebRequest req = UnityWebRequest.Get(url);
        req.SendWebRequest().completed += operation =>
        {
            if (req.result != UnityWebRequest.Result.Success) {
                Debug.Log(req.error);
                callback(false);
                return;
            }
            var wasm = req.downloadHandler.data;
            using (var environment = new Wasm3DotNet.Wrapper.Environment())
            {
                runtime = new Runtime(environment);
                var module = runtime.ParseModule(wasm);

                module.LinkRawFunction("externals", "print_add", "i(ii)", LogInt);

                runtime.LoadModule(module);
                GameObject.CreatePrimitive(PrimitiveType.Sphere);
                var func = runtime.FindFunction("test");
                func.Call(10);
                GameObject.CreatePrimitive(PrimitiveType.Cube);
            }
            callback(true);
        };
    }

    public override int Start()
    {
        return 0;
    }
    public override void Update()
    {
    }
    public override void SandboxExecV_II(int funcId, int i0, int i1)
    {
    }
    public override void SandboxExecV_I(int funcId, int loaderId)
    {
    }

    static IntPtr Abort(IntPtr runtime, IntPtr paramPtr, IntPtr memPtr, IntPtr mem)
    {
        Debug.Log("Abort");
        return IntPtr.Zero;
    }
    static IntPtr LogInt(IntPtr runtime, IntPtr ctx, IntPtr sp, IntPtr mem)
    {
        GameObject.CreatePrimitive(PrimitiveType.Capsule);
        /*
        Debug.Log("LogInt: " + value.ToString());
        */
         var x = Marshal.ReadInt32(sp, 8);
            var y = Marshal.ReadInt32(sp, 16);
            Debug.Log($"x={x}, y={y}");
            // Write result to WASM stack.
            Marshal.WriteInt32(sp, x + y);
        return IntPtr.Zero;
    }
    static IntPtr LogFloat(IntPtr runtime, IntPtr paramPtr, IntPtr memPtr, IntPtr mem)
    {
        // Debug.Log("LogFloat: " + value.ToString());
        return IntPtr.Zero;
    }
    private IntPtr LogString(IntPtr runtime, IntPtr paramPtr, IntPtr memPtr, IntPtr mem)
    {
        /*
        var memory = context.GetMemory(0).Data;
        var str = "";
        unsafe {
            str = Encoding.UTF8.GetString((byte*) memory + ptr, len);
            Debug.Log(str);
        }
        */
        return IntPtr.Zero;
    }

    /**
    private static int ExecI_I(InstanceContext context, int funcId, int i0)
    {
        return GetSandbox().ExecI_I(funcId, i0);
    }

    // To be renamed to ExecI_II_V
    private static int ExecI_II(InstanceContext context, int funcId, int i0, int i1)
    {
        return GetSandbox().ExecI_II_V(funcId, i0, i1, () => {
            Debug.Log("clicked22");
            wasmInstance.Call("onEvent", new object[]{ i0, i1 });
        });
    }

    private static int ExecI_S(InstanceContext context, int funcId, int strPtr, int len)
    {
        var memory = context.GetMemory(0).Data;
        var str = "";
        unsafe {
            str = Encoding.UTF8.GetString((byte*) memory + strPtr, len);
        }
        return GetSandbox().ExecI_S(funcId, str);
    }

    private static int ExecI_IV3(InstanceContext context, int funcId, int i0, float f0, float f1, float f2)
    {
        return GetSandbox().ExecI_IV3(funcId, i0, f0, f1, f2);
    }

    private static int ExecI_IV4(InstanceContext context, int funcId, int i0, float f0, float f1, float f2, float f3)
    {
        return GetSandbox().ExecI_IV4(funcId, i0, f0, f1, f2, f3);
    }

    private int ExecV3_I(InstanceContext context, int funcId, int i0)
    {
        var v = GetSandbox().ExecV3_I(funcId, i0);
        if (v == null)
        {
            return -1;
        }
        else
        {
            unsafe
            {
                var ptr = (float*)context.GetMemory(0).Data;
                *ptr = v.Value.x;
                ptr++;
                *ptr = v.Value.y;
                ptr++;
                *ptr = v.Value.z;
                return 0;
            }
        }
    }
    */
}
